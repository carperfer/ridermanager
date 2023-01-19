<?php

namespace App\Observers;


use App\Events\Event;
use App\Events\UserUpdated;

trait UserObserver
{
    protected static function boot()
    {
        parent::boot();

        static::created(function ($user) {
            event(new UserUpdated($user, Event::CREATE));
        });

        static::updated(function ($user) {
            event(new UserUpdated($user, Event::UPDATE));
        });

        static::deleted(function ($user) {
            event(new UserUpdated($user, Event::DELETE));
        });
    }
}
