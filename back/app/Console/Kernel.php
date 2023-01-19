<?php

namespace App\Console;

use App\Console\Commands\CreateAPIClient;
use App\Console\Commands\CreateIntegration;
use App\Console\Commands\DeleteAPIClient;
use App\Console\Commands\MakeIntegration;
use App\Console\Commands\ViewClear;
use App\Jobs\CheckRiderConnectionJob;
use Illuminate\Console\Scheduling\Schedule;
use Laravel\Lumen\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        ViewClear::class,
        MakeIntegration::class,
        CreateAPIClient::class,
        DeleteAPIClient::class,
        CreateIntegration::class,
    ];

    /**
     * Define the application's command schedule.
     *
     * @param \Illuminate\Console\Scheduling\Schedule $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->call(new CheckRiderConnectionJob());
    }

}
