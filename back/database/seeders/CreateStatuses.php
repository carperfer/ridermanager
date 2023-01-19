<?php

namespace Database\Seeders;

use App\Models\Status;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CreateStatuses extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $successStatuses = Status::SUCCESS_STATUSES;
        $errorStatuses = Status::ERROR_STATUSES;
        $initSort = 0;

        $db = DB::connection();

        try {
            $db->beginTransaction();
            foreach ($successStatuses as $index => $name) {
                if (!Status::where('name', '=', $name)->exists()) {
                    $status = new Status(
                        [
                            'name' => $name,
                            'sort' => $index,
                        ]
                    );
                    $status->save();

                    $this->command->info('Status ' . $status->name . ' created!');
                }
                $db->commit();
            }
            foreach ($errorStatuses as $index => $name) {
                if (!Status::where('name', '=', $name)->exists()) {
                    $status = new Status(
                        [
                            'name' => $name,
                            'sort' => ($initSort - $index -1),
                        ]
                    );
                    $status->save();

                    $this->command->info('Status ' . $status->name . ' created!');
                }
                $db->commit();
            }
        } catch (\Exception $exception) {
            $db->rollBack();
            $this->command->error($exception->getMessage() . ': ' . $exception->getTraceAsString());
        }
    }

}
