<?php

namespace App\Services;

use App\Models\Company;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Support\Str;

class CustomerService
{
    /**
     * @param array $data
     * @return \App\Models\Customer
     */
    public function create(array $data): Customer
    {
        $customer = new Customer($data);
        $customer->external_id = $this->createUuid();

        return $customer;
    }

    /**
     * @return string
     */
    private function createUuid(): string
    {
        do {
            $uuid = (string)Str::uuid();
        } while (Customer::where('external_id', '=', $uuid)->exists());

        return $uuid;
    }

    /**
     * @param \App\Models\Customer $customer
     * @param array                $data
     * @return \App\Models\Customer
     */
    public function edit(Customer $customer, array $data): Customer
    {
        // Update customer
        $customer->fill($data);

        return $customer;
    }

}
