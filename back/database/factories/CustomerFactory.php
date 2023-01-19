<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

class CustomerFactory extends Factory
{
    protected $model = Customer::class;

    public function definition(): array
    {
        return [
            'name'         => $this->faker->company,
            'address'      => $this->faker->streetAddress,
            'address_info' => $this->faker->secondaryAddress,
            'city'         => $this->faker->city,
            'zip'          => $this->faker->postcode,
            'phone'        => $this->faker->phoneNumber,
            'lat'          => $this->faker->latitude,
            'lon'          => $this->faker->longitude,
        ];
    }

}
