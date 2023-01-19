<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateUsersCompaniesRelationship extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Create table users-companies-roles
        Schema::create('users_companies_roles', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained();
            $table->foreignId('company_id')->constrained();
            $table->foreignId('role_id')->constrained();
            $table->timestamps();
            $table->softDeletes();

            $table->primary(['user_id', 'company_id']);
        });

        // Populate table with existing data
        \Illuminate\Support\Facades\Artisan::call('db:seed', ['--class' => 'PopulateUserMulticompanyTable', '--force' => true]);

        // Delete FK on users
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('company_id');
            $table->dropConstrainedForeignId('role_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('company_id')->nullable()->constrained();
            $table->foreignId('role_id')->nullable()->constrained();
        });

        \Illuminate\Support\Facades\Artisan::call('db:seed', ['--class' => 'RollbackUsersMulticompany', '--force' => true]);

        Schema::dropIfExists('users_companies_roles');
    }

}
