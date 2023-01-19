<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RollbackPaymentTypesUpdate extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $orders = DB::table('orders')->get(['id', 'payment_type_id']);
        foreach ($orders as $orderPayment) {
            DB::table('orders')->where('id', '=', $orderPayment->id)->update(['payment_type' => $orderPayment->payment_type_id]);
        }
    }

}
