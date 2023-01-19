<?php

namespace Database\Factories;

use App\Models\OrderHistory;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderHistoryFactory extends Factory
{
    protected $model = OrderHistory::class;

    public function definition(): array
    {
        return [
            'order_id'  => rand(1, 10),
            'status_id' => rand(1, 10),
            'comments'  => $this->faker->text(255),
        ];
    }

}
