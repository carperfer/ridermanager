<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CreateRolesPermissions extends Seeder
{
    const ADMIN       = 'administrator';
    const DRIVER      = 'driver';

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $db = DB::connection();
        try {
            $db->beginTransaction();

            // Create roles
            $admin = Role::where('name', '=', self::ADMIN)->first();
            if (!$admin) {
                $admin = Role::create(['name' => self::ADMIN]);
                $this->command->info(self::ADMIN . ' role has been created successfully!');
            }

            $driver = Role::where('name', '=', self::DRIVER)->first();
            if (!$driver) {
                $driver = Role::create(['name' => self::DRIVER]);
                $this->command->info(self::DRIVER . ' role has been created successfully!');
            }

            // Create and attach permissions
            foreach (Permission::PERMISSIONS as $name) {
                $permission = Permission::where('name', '=', $name)->first();
                if (!$permission) {
                    $permission = Permission::create(['name' => $name]);
                    $this->command->info($name . ' permission has been created successfully!');
                }

                if (!$admin->permissions()->where('name', '=', $name)->exists()) {
                    $admin->permissions()->attach($permission->id);
                }
                // Assign only update status to driver
                if ($name === 'update-status' && !$driver->permissions()->where('name', '=', $name)->exists()) {
                    $driver->permissions()->attach($permission->id);
                }
            }

            $db->commit();
        } catch (\Exception $exception) {
            $db->rollBack();
            $this->command->error($exception->getMessage() . ': ' . $exception->getTraceAsString());
        }
    }

}
