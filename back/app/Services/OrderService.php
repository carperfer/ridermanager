<?php

namespace App\Services;

use App\Models\ApiClient;
use App\Models\Company;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderHistory;
use App\Models\OrderIntegration;
use App\Models\PaymentType;
use App\Models\Status;
use App\Models\User;
use Illuminate\Support\Str;

class OrderService
{
    /**
     * @param array                     $data
     * @param \App\Models\Customer|null $customer
     * @return \App\Models\Order
     */
    public function create(array $data, ?Customer $customer = null): Order
    {
        // Add initial data
        $order = new Order($data);
        $order->number = isset($data['number']) ? $data['number'] : $this->createOrderNumber();
        $order->pickup_info = $customer ? $this->getAddressBodyBase($customer->toArray()) : $this->getAddressBodyBase($data['pickup_info']);
        $order->delivery_info = $this->getAddressBodyBase($data['delivery_info']);
        $order->total = isset($data['total']) ? $data['total'] : 0;
        $order->is_already_paid = isset($data['is_already_paid']) ? $data['is_already_paid'] : false;
        $order->money_change = isset($data['money_change']) ? $data['money_change'] : 0;

        return $order;
    }

    /**
     * @param \App\Models\Order $order
     * @param array             $data
     * @return \App\Models\Order
     */
    public function edit(Order $order, array $data): Order
    {
        // Back up order model to use it within the function
        $oldOrder = clone $order;

        // Fill data
        $order->fill($data);
        $order->pickup_info = $order->pickup_info !== $oldOrder->pickup_info ? $this->getAddressBodyBase($data['pickup_info']) : $oldOrder->pickup_info;
        $order->delivery_info = $order->delivery_info !== $oldOrder->delivery_info ? $this->getAddressBodyBase($data['delivery_info']) : $oldOrder->delivery_info;
        $order->total = isset($data['total']) ? $data['total'] : $oldOrder->total;
        $order->comments = isset($data['comments']) && $data['comments'] ? $data['comments'] : $oldOrder->comments;
        $order->is_already_paid = isset($data['is_already_paid']) ? $data['is_already_paid'] : $oldOrder->is_already_paid;
        $order->money_change = isset($data['money_change']) ? $data['money_change'] : $oldOrder->money_change;

        return $order;
    }

    /**
     * @param \App\Models\Order $order
     * @param mixed             ...$relationships
     */
    public function addRelationships(Order $order, ...$relationships)
    {
        foreach ($relationships as $relationship) {
            if ($relationship instanceof (Company::class)) {
                $order->company()->associate($relationship);
            }
            if ($relationship instanceof (Customer::class)) {
                $order->customer()->associate($relationship);
            }
            if ($relationship instanceof (Status::class)) {
                $order->status()->associate($relationship);
            }
            if ($relationship instanceof (PaymentType::class)) {
                $order->paymentType()->associate($relationship);
            }
        }
    }

    /**
     * @return string
     */
    private function createOrderNumber(): string
    {
        return Str::upper(Str::random(8));
    }

    /**
     * @param \App\Models\Order                      $order
     * @param \App\Models\User|\App\Models\ApiClient $author
     * @param \App\Models\OrderHistory|null          $history
     * @param string|null                            $comments
     * @return \App\Models\OrderHistory
     */
    public function createHistory(Order $order, User|ApiClient $author, ?OrderHistory $history = null, ?string $comments = ''): OrderHistory
    {
        $comments = $this->addAuthorComment($author) . ': ' . $comments;
        if ($history && $history->status_id === $order->status_id) {
            $history->comments = $comments;
            return $history;
        }

        return new OrderHistory(['order_id' => $order->id, 'status_id' => $order->status_id, 'comments' => $comments]);
    }

    /**
     * @param array $info
     * @return array
     */
    private function getAddressBodyBase(array $info): array
    {
        return [
            'name'         => isset($info['name']) ? $info['name'] : '',
            'phone'        => isset($info['phone']) ? $info['phone'] : '',
            'address'      => isset($info['address']) ? $info['address'] : '',
            'address_info' => isset($info['address_info']) ? $info['address_info'] : '',
            'zip'          => isset($info['zip']) ? $info['zip'] : '',
            'city'         => isset($info['city']) ? $info['city'] : '',
            'lat'          => isset($info['lat']) ? $info['lat'] : 0,
            'lon'          => isset($info['lon']) ? $info['lon'] : 0,
        ];
    }

    /**
     * Return the name of the author, that is either a user or an integration service.
     *
     * @param \App\Models\ApiClient|\App\Models\User $author
     * @return string
     */
    private function addAuthorComment(ApiClient|User $author): string
    {
        return $author instanceof User ? $author->first_name . ' ' . $author->last_name : $author->integration->name;
    }

}
