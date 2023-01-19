<?php

namespace App\Observers;

use App\Events\Event;
use App\Events\UserUpdated;
use App\Models\UserLocation;

trait LocationObserver
{
    protected static function boot()
    {
        parent::boot();

        static::saved(function (UserLocation $location) {
            event(new UserUpdated($location->user, Event::UPDATE));
        });

        static::deleted(function (UserLocation $location) {
            event(new UserUpdated($location->user, Event::UPDATE));
        });
    }

}
