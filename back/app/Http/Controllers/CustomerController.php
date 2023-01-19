<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Customer;
use App\Rules\CustomerRules;
use App\Services\CustomerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
    private CustomerService $customerService;

    public function __construct(Request $request, CustomerService $customerService)
    {
        parent::__construct($request);
        $this->customerService = $customerService;
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function index(): JsonResponse
    {
        $this->validate($this->request, CustomerRules::filtersRules());

        // Get company and check the user belongs to it
        $company = Company::getByField('id', $this->request->company_id);
        $this->authorize(self::PERMISSION_POLICY, $company);

        return response()->json($company->customers);
    }

    /**
     * @param $uuid
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($uuid): JsonResponse
    {
        // Get customer by UUID as this is not middlewared
        $customer = Customer::getByField('external_id', $uuid);

        return response()->json($customer);
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Throwable
     */
    public function store(): JsonResponse
    {
        $this->validate($this->request, CustomerRules::rules());

        // Get company and check user can manage its customers
        $company = Company::getByField('id', $this->request->company_id);
        $this->authorize(self::PERMISSION_POLICY, [$company, 'manage-customers']);

        // Create customer
        $customer = $this->customerService->create($this->request->all());
        $customer->company()->associate($company);
        $customer->save();

        return response()->json($customer, 201);
    }

    /**
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Throwable
     */
    public function update($id): JsonResponse
    {
        $this->validate($this->request, CustomerRules::updateRules());

        $db = DB::connection();
        $db->beginTransaction();

        try {
            $customer = Customer::getByField('id', $id);
            $this->authorize(self::PERMISSION_POLICY, [$customer->company, 'manage-customers']);

            $this->customerService->edit($customer, $this->request->all());
            $customer->save();

            $db->commit();
        } catch (\Throwable $e) {
            $db->rollBack();
            throw $e;
        }

        return response()->json($customer);
    }

    /**
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     * @throws \Throwable
     */
    public function destroy($id): JsonResponse
    {
        $db = DB::connection();
        $db->beginTransaction();

        try {
            // Get customer, check permission, and delete orders attached and customer
            $customer = Customer::getByField('id', $id);
            $this->authorize(self::PERMISSION_POLICY, [$customer->company, 'manage-customers']);
            $customer->orders()->delete();
            $customer->delete();

            $db->commit();
        } catch (\Throwable $e) {
            $db->rollBack();
            throw $e;
        }

        return response()->json([]);
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Throwable
     */
    public function bulkDestroy(): JsonResponse
    {
        $this->validate($this->request, CustomerRules::bulkDeleteRules());
        $this->authorize(self::PERMISSION_POLICY, [$this->company, 'manage-customers']);

        $db = DB::connection();
        $db->beginTransaction();

        try {
            // Get list of customers by params and delete them
            $customers = Customer::whereIn('id', $this->request->customers_id)
                ->where('company_id', '=', $this->request->company_id)
                ->get();
            $customers->each(function ($customer) {
                $customer->orders()->delete();
                $customer->delete();
            });

            $db->commit();
        } catch (\Throwable $e) {
            $db->rollBack();
            throw $e;
        }

        return response()->json([]);
    }

}

