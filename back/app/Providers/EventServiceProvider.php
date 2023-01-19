<?php

namespace App\Providers;

use App\Events\OrderCreated;
use App\Events\OrderDeleted;
use App\Events\OrderUpdated;
use App\Events\UserUpdated;
use App\Listeners\OrderCreatedListener;
use App\Listeners\OrderUpdatedListener;
use App\Listeners\OrderDeletedListener;
use App\Listeners\UserUpdatedListener;
use Laravel\Lumen\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        OrderCreated::class => [
            OrderCreatedListener::class,
        ],
        OrderUpdated::class => [
            OrderUpdatedListener::class,
        ],
        OrderDeleted:: class => [
            OrderDeletedListener::class,
        ],
        UserUpdated::class => [
            UserUpdatedListener::class,
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();
        //
    }

}
