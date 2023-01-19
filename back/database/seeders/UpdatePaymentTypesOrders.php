<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\PaymentType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UpdatePaymentTypesOrders extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $defaultPayment = $this->getDefaultPaymentType();

        $orders = DB::table('orders')->get(['id', 'payment_type']);
        foreach ($orders as $orderPayment) {
            $order = Order::withTrashed()->find($orderPayment->id);
            $payment = PaymentType::find($orderPayment->payment_type);

            if ($payment) {
                $this->command->info('Associating ' . $payment->id . ' to order #' . $order->number);
                $order->paymentType()->associate($payment);
            } else {
                $this->command->info('Associating ' . $defaultPayment->id . ' to order #' . $order->number);
                $order->paymentType()->associate($defaultPayment);
            }
            $order->save();
        }
    }

    private function getDefaultPaymentType()
    {
        return PaymentType::where('name', '=', 'others')->first();
    }

}
