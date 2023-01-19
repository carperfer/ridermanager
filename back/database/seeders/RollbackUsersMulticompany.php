<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RollbackUsersMulticompany extends Seeder
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
        $users = $database->table('users_companies_roles')->get();

        try {
            // Insert data in new table for each user
            $users->each(function ($user) use ($database) {
                $values = [
                    'company_id' => $user->company_id,
                    'role_id'    => $user->role_id,
                ];
                $database->table('users')->where('id', '=', $user->user_id)->update($values);
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
