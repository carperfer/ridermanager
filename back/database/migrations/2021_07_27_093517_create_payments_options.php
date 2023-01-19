<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentsOptions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table(
            'orders',
            function (Blueprint $table) {
                $table->integer('payment_type')->after('total')->nullable();
                $table->integer('is_already_paid')->after('payment_type')->nullable();
                $table->integer('money_change')->after('is_already_paid')->nullable();
            }
        );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table(
            'orders',
            function (Blueprint $table) {
                $table->dropColumn('money_change');
                $table->dropColumn('is_already_paid');
                $table->dropColumn('payment_type');
            }
        );
    }
}
