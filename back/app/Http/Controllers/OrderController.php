<?php

namespace App\Http\Controllers;

use App\Events\OrderCreated;
use App\Events\OrderUpdated;
use App\Events\OrderDeleted;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderHistory;
use App\Models\PaymentType;
use App\Models\Status;
use App\Models\User;
use App\Rules\OrderRules;
use App\Rules\UserRules;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class OrderController extends Controller
{
    private OrderService $orderService;

    public function __construct(Request $request, OrderService $orderService)
    {
        parent::__construct($request);
        $this->orderService = $orderService;
    }

    /**
     * @return JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function index(): JsonResponse
    {
        $this->validate($this->request, OrderRules::filtersRules());

        $this->authorize(self::PERMISSION_POLICY, $this->company);

        return response()->json(Order::getWithFilters($this->company, $this->request->all()));
    }

    /**
     * @param int $id
     * @return JsonResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function show(int $id): JsonResponse
    {
        // Get order
        $order = Order::getByField('id', $id);

        // Check order belongs to the same company as user
        $this->authorize(self::PERMISSION_POLICY, $order->company);

        // Add history and status info
        $order->history;
        $order->status;

        return response()->json($order);
    }

    /**
     * @return JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Throwable
     */
    public function store(): JsonResponse
    {
        $this->validate($this->request, OrderRules::webRules());

        $db = DB::connection();
        $db->beginTransaction();

        try {
            // Get models to assign
            $status = Status::getByField('name', Status::DEFAULT_VALUE);
            $customer = $this->company->getCustomerFromCompany($this->request->customer_id);
            $payment = PaymentType::getOrDefault($this->request->payment_type_id);

            // Verify the requesting user has permission to create orders in this company
            $this->authorize(self::PERMISSION_POLICY, [$this->company, 'create-orders']);

            // Create order
            $order = $this->orderService->create($this->request->all(), $customer);
            $this->orderService->addRelationships($order, $status, $this->company, $payment, $customer);
            $order->save();

            // Create first history record
            $history = $this->orderService->createHistory($order, $this->request->user());
            $history->save();

            $db->commit();
        } catch (Throwable $e) {
            $db->rollBack();
            throw $e;
        }

        return response()->json($order, 201);
    }

    /**
     * @param int $id
     * @return JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Throwable
     */
    public function update(int $id): JsonResponse
    {
        $this->validate($this->request, OrderRules::webRules());

        $db = DB::connection();
        $db->beginTransaction();

        try {
            // Get models to assign
            $customer = $this->company->getCustomerFromCompany($this->request->customer_id);
            $payment = PaymentType::getOrDefault($this->request->payment_type_id);

            // Verify the requesting user has permission to create orders in this company
            $this->authorize(self::PERMISSION_POLICY, [$this->company, 'edit-orders']);

            // Update order
            $order = $this->orderService->edit(Order::getByField('id', $id), $this->request->all());
            $this->orderService->addRelationships($order, $this->company, $payment, $customer);

            $order->save();

            $db->commit();
        } catch (Throwable $e) {
            $db->rollBack();
            throw $e;
        }

        return response()->json($order);
    }

    /**
     * @param int $id
     * @return JsonResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function destroy(int $id): JsonResponse
    {
        // Get order
        $order = Order::getByField('id', $id);

        // Check order belongs to the same company as user
        $this->authorize(self::PERMISSION_POLICY, [$order->company, 'remove-orders']);

        // Delete order
        $order->delete();

        return response()->json([]);
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Throwable
     */
    public function bulkDestroy(): JsonResponse
    {
        $this->validate($this->request, OrderRules::bulkDeleteRules());
        $this->authorize(self::PERMISSION_POLICY, [$this->company, 'remove-orders']);

        $db = DB::connection();
        $db->beginTransaction();

        try {
            // Get orders listed in request that belong to the user companies list
            $orders = Order::whereIn('id', $this->request->orders_id)
                ->where('company_id', '=', $this->request->company_id)
                ->get();
            $orders->each(function ($order) {
                $order->delete();
            });

            $db->commit();
        } catch (\Throwable $e) {
            $db->rollBack();
            throw $e;
        }
        return response()->json([]);
    }

    /**
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Throwable
     */
    public function updateAssignation(int $id): JsonResponse
    {
        $this->validate($this->request, OrderRules::assignationUpdateRules());

        $db = DB::connection();
        $db->beginTransaction();

        try {
            // Get order and check permission
            $order = Order::getByField('id', $id);
            $this->authorize(self::PERMISSION_POLICY, [$order->company, 'update-status']);

            // Handle assignation
            $user = $order->company->getUserFromCompany($this->request->user_id);
            $order->user()->associate($user);
            $this->handleAssignedStatus($order);
            $order->save();

            $db->commit();
        } catch (Throwable $e) {
            $db->rollBack();
            throw $e;
        }
        return response()->json($order);
    }

    /**
     * @param int $id
     * @return JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Throwable
     */
    public function updateStatus(int $id): JsonResponse
    {
        $this->validate($this->request, OrderRules::statusUpdateRules());

        $db = DB::connection();
        $db->beginTransaction();

        try {
            // Get order and check permission
            $order = Order::getByField('id', $id);
            $this->authorize(self::PERMISSION_POLICY, [$order->company, 'update-status']);

            // Get new status; if assigned, it cannot be In Queue
            $status = $order->status->name === Status::DEFAULT_VALUE && $order->user_id !== null
                ? Status::getByField('name', Status::ACCEPTED_STATUS)
                : Status::getByField('id', $this->request->status_id);
            $this->orderService->addRelationships($order, $status);
            $order->save();

            // Save new history step
            $history = $this->orderService->createHistory($order, $this->request->user(), OrderHistory::where('order_id', '=', $order->id)->latest()->first(), $this->request->comments);
            $history->save();

            $db->commit();
        } catch (Throwable $e) {
            $db->rollBack();
            throw $e;
        }
        return response()->json($order);
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function getOrdersAssigned(): JsonResponse
    {
        $this->validate($this->request, OrderRules::filterDates());

        $orders = $this->request->user()->getOrdersAssignedWithFilters($this->request->only(array_keys(OrderRules::filterDates())));

        return response()->json($orders);
    }

    /* * * * * * * * * * * * * * *
     * ENDPOINTS FOR MOBILE APP  *
     * * * * * * * * * * * * * * */

    /**
     * @param int $id
     * @return JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function getUserOrders(int $id): JsonResponse
    {
        $this->validate($this->request, UserRules::companyIdRules());

        $user = User::with('orders')
            ->where('id', '=', $id)
            ->whereHas('companies', function ($query) {
                return $query->where('company_id', '=', $this->request->company_id);
            })
            ->first();

        return response()->json($user);
    }

    /* * * * * * * * * * * * * *
     * ENDPOINTS FOR CUSTOMERS *
     * * * * * * * * * * * * * */

    /**
     * @throws \Illuminate\Validation\ValidationException
     */
    public function getCustomer(string $uuid): JsonResponse
    {
        $this->validate($this->request, OrderRules::filterDates());

        $customer = Customer::getByField('external_id', $uuid);
        $orders = $customer->orders()->with('history')->get();

        return response()->json($orders);
    }

    /**
     * @throws \Throwable
     * @throws \Illuminate\Validation\ValidationException
     */
    public function storeCustomer(): JsonResponse
    {
        $this->validate($this->request, OrderRules::customerRules());

        $db = DB::connection();
        $db->beginTransaction();

        try {
            // Get models to assign
            $status = Status::getOrDefault($this->request->status_id);
            $customer = Customer::getAndCheck($this->request->customer_id, 'external_id', $this->request->customer_external_id);
            $payment = PaymentType::getOrDefault($this->request->payment_type_id);

            // Create order
            $order = $this->orderService->create($this->request->all(), $customer);
            $this->orderService->addRelationships($order, $status, $customer->company, $payment);
            $order->save();

            // Create history
            $history = $this->orderService->createHistory($order, $this->request->user());
            $history->save();

            $db->commit();
        } catch (Throwable $e) {
            $db->rollBack();
            throw $e;
        }

        return response()->json($order, 201);
    }

    /* * * * * * * * * * * * * * *
     * ENDPOINTS FOR API CLIENTS *
     * * * * * * * * * * * * * * */

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function getOrders(): JsonResponse
    {
        $orders = Order::whereHas('integration', function ($query) {
            return $query->where('api_client_id', '=', $this->request->user('api')->id);
        })->get();

        return response()->json($orders);
    }

    /**
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function showOrder(string $id): JsonResponse
    {
        $order = Order::whereHas('integration', function ($query) use ($id) {
            return $query
                ->where('api_client_id', '=', $this->request->user('api')->id)
                ->where('external_id', '=', $id);
        })->first();
        optional($order)->history;

        return response()->json($order);
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Throwable
     */
    public function handleOrder(): JsonResponse
    {
        $this->validate($this->request, OrderRules::apiRules());

        $db = DB::connection();
        $db->beginTransaction();

        try {
            $existingOrder = Order::whereHas('integration', function ($query) {
                return $query
                    ->where('api_client_id', '=', $this->request->user('api')->id)
                    ->where('external_id', '=', $this->request->external_id);
            })->first();

            // If order does not exist, create a new one. If it exists, update it
            $order = $existingOrder === null ? $this->createOrderIntegration() : $this->updateOrderIntegration($existingOrder);

            $db->commit();
        } catch (Throwable $e) {
            $db->rollBack();
            throw $e;
        }

        return response()->json($order, 201);
    }

    /**
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     * @throws \Throwable
     */
    public function cancelOrder(string $id): JsonResponse
    {
        $db = DB::connection();
        $db->beginTransaction();

        try {
            $order = Order::whereHas('integration', function ($query) use ($id) {
                return $query
                    ->where('api_client_id', '=', $this->request->user('api')->id)
                    ->where('external_id', '=', $id);
            })->first();
            $status = Status::getByField('name', Status::CANCELED_STATUS);

            // Update status
            $this->orderService->addRelationships($order, $status);
            // Detach from user
            $order->user()->dissociate();
            $order->save();

            // Create history
            $history = $this->orderService->createHistory($order, $this->request->user('api'));
            $history->save();

            $db->commit();
        } catch (Throwable $e) {
            $db->rollBack();
            throw $e;
        }

        return response()->json([], 204);
    }

    /**
     * @return \App\Models\Order
     */
    private function createOrderIntegration(): Order
    {
        // Get models to assign
        $status = Status::where('name', '=', Status::DEFAULT_VALUE)->first();
        $payment = PaymentType::getOrDefault($this->request->payment_type_id);

        // Create order and relationships
        $order = $this->orderService->create($this->request->all());
        $this->orderService->addRelationships($order, $status, $this->request->user('api')->company, $payment);
        $order->save();

        // Create history
        $history = $this->orderService->createHistory($order, $this->request->user('api'));
        $history->save();

        // Create integration
        $order->integration()->create(['api_client_id' => $this->request->user('api')->id, 'external_id' => $this->request->external_id]);

        return $order;
    }

    /**
     * @param \App\Models\Order $order
     * @return \App\Models\Order
     */
    private function updateOrderIntegration(Order $order): Order
    {
        $status = Status::getOrDefault($this->request->status_id);
        $payment = PaymentType::getOrDefault($this->request->payment_type_id);

        // Update order
        $order = $this->orderService->edit($order, $this->request->only(array_keys(OrderRules::apiRules())));
        $this->orderService->addRelationships($order, $status, $this->request->user('api')->company, $payment);
        $order->save();

        // Create history
        $history = $this->orderService->createHistory($order, $this->request->user('api'));
        $history->save();

        return $order;
    }

    /**
     * Update the status into the one allowed for assigned orders
     *
     * @param \App\Models\Order $order
     */
    private function handleAssignedStatus(Order $order)
    {
        if ($order->status->name === Status::DEFAULT_VALUE) {
            $status = Status::getByField('name', Status::ACCEPTED_STATUS);
            $this->orderService->addRelationships($order, $status);
        }
    }

}
