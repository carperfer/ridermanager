<?php

namespace Database\Seeders;

use App\Models\PaymentType;
use Illuminate\Database\Seeder;

class CreatePaymentTypes extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        foreach (PaymentType::$typeNames as $typeName) {
            if (!PaymentType::where('name', '=', $typeName)->exists()) {
                PaymentType::create(['name' => $typeName]);
            }
        }
    }

}
