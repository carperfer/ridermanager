<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class FixPaymentDefinition extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Create new table
        Schema::create('payment_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
        });

        // Create FK column
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('payment_type_id')->after('customer_id')->nullable()->constrained();
        });

        // Populate table
        \Illuminate\Support\Facades\Artisan::call('db:seed', [
            '--class' => 'CreatePaymentTypes',
            '--force' => true,
        ]);

        // Move data from old to new column
        \Illuminate\Support\Facades\Artisan::call('db:seed', [
            '--class' => 'UpdatePaymentTypesOrders',
            '--force' => true,
        ]);

        // Turn NULL records into boolean in field `is_already_paid`
        DB::table('orders')->whereNull('is_already_paid')->update(['is_already_paid' => true]);
        DB::table('orders')->whereNull('money_change')->update(['money_change' => 0]);

        // Set payment_type_id as not nullable
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('payment_type_id')->nullable(false)->change();
        });

        // Delete old column and update other fields
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('payment_type');
            $table->boolean('is_already_paid')->nullable(false)->change();
            $table->integer('money_change')->nullable(false)->default(0)->change();
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
            $table->integer('money_change')->nullable(true)->change();
            $table->boolean('is_already_paid')->nullable(true)->change();
            $table->integer('payment_type')->after('total')->nullable();
        });

        \Illuminate\Support\Facades\Artisan::call('db:seed', [
            '--class' => 'RollbackPaymentTypesUpdate',
            '--force' => true,
        ]);

        Schema::table('orders', function (Blueprint $table) {
            $table->dropConstrainedForeignId('payment_type_id');
        });

        Schema::dropIfExists('payment_types');
    }

}
