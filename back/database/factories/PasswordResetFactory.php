<?php

namespace Database\Factories;

use App\Models\PasswordReset;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PasswordResetFactory extends Factory
{
    protected $model = PasswordReset::class;

    public function definition(): array
    {
        return [
            'token'   => $this->faker->uuid,
        ];
    }

}
