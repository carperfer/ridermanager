<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDatabaseStructure extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(
            'companies',
            function (Blueprint $table) {
                $table->id();
                $table->string('name')->nullable(false);
                $table->boolean('verified')->default(false);
                $table->timestamps();
                $table->softDeletes();
            }
        );

        Schema::create(
            'statuses',
            function (Blueprint $table) {
                $table->id();
                $table->integer('sort')->nullable(false)->unique();
                $table->string('name')->nullable(false)->unique()->index();
            }
        );

        Schema::create(
            'permissions',
            function (Blueprint $table) {
                $table->id();
                $table->string('name')->nullable(false)->index();
            }
        );

        Schema::create(
            'roles',
            function (Blueprint $table) {
                $table->id();
                $table->string('name')->nullable(false)->index();
            }
        );

        Schema::create(
            'permission_role',
            function (Blueprint $table) {
                $table->foreignId('permission_id')->constrained();
                $table->foreignId('role_id')->constrained();

                $table->primary(['role_id', 'permission_id']);
            }
        );

        Schema::create(
            'invites',
            function (Blueprint $table) {
                $table->id();
                $table->string('email')->unique();
                $table->uuid('token')->nullable(false)->index();
                $table->foreignId('company_id')->constrained();
                $table->foreignId('role_id')->constrained();
                $table->timestamps();
            }
        );

        Schema::create(
            'users',
            function (Blueprint $table) {
                $table->id();
                $table->string('email')->nullable(false)->unique();
                $table->string('password')->nullable(false);
                $table->rememberToken();
                $table->string('first_name')->nullable(false);
                $table->string('last_name')->nullable(false);
                $table->string('phone')->nullable(false);
                $table->string('expo_token')->nullable();
                $table->foreignId('company_id')->constrained();
                $table->foreignId('role_id')->constrained();
                $table->timestamps();
                $table->softDeletes();
            }
        );

        Schema::create(
            'customers',
            function (Blueprint $table) {
                $table->id();
                $table->string('name')->nullable(false);
                $table->uuid('external_id')->nullable(false)->unique();
                $table->string('address')->nullable(false);
                $table->string('address_info')->nullable();
                $table->string('city')->nullable(false);
                $table->string('zip')->nullable(false);
                $table->string('phone')->nullable(false);
                $table->decimal('lat', 10, 8)->nullable(false)->default(0);
                $table->decimal('lon', 11, 8)->nullable(false)->default(0);
                $table->foreignId('company_id')->constrained();
                $table->timestamps();
                $table->softDeletes();
            }
        );

        Schema::create(
            'orders',
            function (Blueprint $table) {
                $table->id();
                $table->string('number')->nullable(false)->index();
                $table->dateTime('pickup_at');
                $table->json('pickup_info');
                $table->dateTime('deliver_at');
                $table->json('delivery_info');
                $table->string('comments', 500)->nullable(false)->default('');
                $table->foreignId('user_id')->nullable()->constrained();
                $table->foreignId('status_id')->default(1)->constrained();
                $table->foreignId('company_id')->constrained();
                $table->foreignId('customer_id')->nullable()->constrained();
                $table->timestamps();
                $table->softDeletes();
            }
        );

        Schema::create(
            'orders_history',
            function (Blueprint $table) {
                $table->id();
                $table->foreignId('order_id')->constrained();
                $table->foreignId('status_id')->constrained();
                $table->string('comments', 200)->nullable(false)->default('');
                $table->timestamps();
            }
        );

        Schema::create(
            'password_resets',
            function (Blueprint $table) {
                $table->id();
                $table->uuid('token')->unique()->index();
                $table->foreignId('user_id')->constrained();
                $table->timestamps();
            }
        );

        // Populate tables
        \Illuminate\Support\Facades\Artisan::call('db:seed');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('password_resets');
        Schema::dropIfExists('orders_history');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('customers');
        Schema::dropIfExists('users');
        Schema::dropIfExists('invites');
        Schema::dropIfExists('permission_role');
        Schema::dropIfExists('roles');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('statuses');
        Schema::dropIfExists('companies');
    }

}
