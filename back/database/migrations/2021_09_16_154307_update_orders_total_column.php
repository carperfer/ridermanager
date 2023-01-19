<?php

use App\Models\Order;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateOrdersTotalColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Update NULL values into 0
        \Illuminate\Support\Facades\DB::table('orders')->whereNull('total')->update(['total' => 0]);

        Schema::table('orders', function (Blueprint $table) {
            $table->integer('total')->nullable(false)->default(0)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->integer('total')->nullable(true)->change();
        });
    }

}
