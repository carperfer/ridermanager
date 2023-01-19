<?php

namespace App\Listeners;

use App\Events\Event;
use App\Events\OrderDeleted;
use App\Jobs\SendAssignationWebsocketJob;
use App\Jobs\SendOrderWebsocketJob;

class OrderDeletedListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param OrderDeleted $event
     * @return void
     */
    public function handle(OrderDeleted $event)
    {
        // Send to Websocket server
        dispatch(new SendOrderWebsocketJob($event->order, Event::DELETE));

        // If user assigned: send to user's websocket
        if ($event->order->user !== null) {
            dispatch(new SendAssignationWebsocketJob($event->order, $event->order->user_id, Event::DELETE));
        }
    }

}
