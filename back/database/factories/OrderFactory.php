<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        return [
            'number'          => $this->faker->text(8),
            'pickup_at'       => $this->faker->date('Y-m-d H:i:s'),
            'pickup_info'     => [
                'lat'          => $this->faker->latitude,
                'lon'          => $this->faker->longitude,
                'zip'          => $this->faker->postcode,
                'city'         => $this->faker->city,
                'name'         => $this->faker->name,
                'phone'        => $this->faker->phoneNumber,
                'address'      => $this->faker->streetAddress,
                'address_info' => $this->faker->secondaryAddress,
            ],
            'deliver_at'      => $this->faker->date('Y-m-d H:i:s'),
            'delivery_info'   => [
                'lat'          => $this->faker->latitude,
                'lon'          => $this->faker->longitude,
                'zip'          => $this->faker->postcode,
                'city'         => $this->faker->city,
                'name'         => $this->faker->name,
                'phone'        => $this->faker->phoneNumber,
                'address'      => $this->faker->streetAddress,
                'address_info' => $this->faker->secondaryAddress,
            ],
            'total'           => $this->faker->numberBetween(),
            'is_already_paid' => $this->faker->boolean(),
            'money_change'    => $this->faker->numberBetween(),
            'comments'        => $this->faker->text,
        ];
    }

}
