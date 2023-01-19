<?php

namespace App\Observers;

use App\Events\Event;
use App\Events\OrderCreated;
use App\Events\OrderDeleted;
use App\Events\OrderUpdated;
use App\Jobs\SendAssignationWebsocketJob;
use App\Models\Status;

trait OrderObserver
{
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($order) {
            // If order is canceled it cannot be assigned to a user
            if ($order->status->name === Status::CANCELED_STATUS && $order->user_id !== null) {
                dispatch(new SendAssignationWebsocketJob($order, $order->user_id, Event::DELETE));
                $order->user()->dissociate();
            }
        });

        static::created(function ($order) {
            event(new OrderCreated($order));
        });

        static::updated(function ($order) {
            event(new OrderUpdated($order));
        });

        static::deleted(function ($order) {
            event(new OrderDeleted($order));
        });
    }

}
