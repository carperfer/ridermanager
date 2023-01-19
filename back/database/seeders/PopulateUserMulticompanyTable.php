<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PopulateUserMulticompanyTable extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Init transaction
        $database = DB::connection();
        $database->beginTransaction();

        // Get all users
        $users = $database->table('users')->get();

        try {
            // Insert data in new table for each user
            $users->each(function ($user) use ($database) {
                $values = [
                    'user_id'    => $user->id,
                    'company_id' => $user->company_id,
                    'role_id'    => $user->role_id,
                ];
                $database->table('users_companies_roles')->insert($values);
            });

            // Commit transaction
            $database->commit();
        } catch (\Exception $exception) {
            // Log error and discard transaction
            Log::error($exception->getMessage());
            $database->rollBack();
        }
    }

}
