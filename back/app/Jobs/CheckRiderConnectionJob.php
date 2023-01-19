<?php

namespace App\Jobs;

use App\Models\UserLocation;

class CheckRiderConnectionJob extends Job
{

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
    }

    public function __invoke()
    {
        $this->handle();
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $locations = UserLocation::all();
        foreach ($locations as $location) {
            // If user is online (has location stored), and it was updated between 25-30 min ago: send notification.
            // If it was updated more than 30 min ago, turn it offline (delete location).
            $diff = time() - strtotime($location->updated_at);
            if ($diff >= 1500 && $diff < 1800) {
                $this->notifyExpiration($location);
            } elseif ($diff >= 1800) {
                $location->delete();
            }
        }
    }

    private function notifyExpiration(UserLocation $location)
    {
        dispatch(
            new ExponentPushJob(
                $location->user,
                'Tu sesión caducará pronto',
                '¡Abre la app para actualizar tu localización!'
            )
        );
    }

}
