<?php

namespace Database\Factories;

use App\Models\Status;
use Illuminate\Database\Eloquent\Factories\Factory;

class StatusFactory extends Factory
{
    protected $model = Status::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->text(10),
            'sort' => $this->faker->numberBetween(1, 10),
        ];
    }

}
