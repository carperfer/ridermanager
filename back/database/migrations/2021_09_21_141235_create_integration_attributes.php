<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateIntegrationAttributes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('integrations', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('callback_url');
            $table->timestamps();
        });

        Schema::dropIfExists('api_clients');
        Schema::create('api_clients', function (Blueprint $table) {
            $table->id();
            $table->string('token')->nullable();
            $table->string('api_key')->nullable();
            $table->foreignId('company_id')->constrained();
            $table->foreignId('integration_id')->constrained();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('orders_integrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->unique()->constrained();
            $table->foreignId('api_client_id')->constrained();
            $table->string('external_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders_integrations');
        Schema::dropIfExists('api_clients');
        Schema::dropIfExists('integrations');
    }

}
