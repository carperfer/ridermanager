<?php

namespace App\Listeners;

use App\Events\Event;
use App\Events\OrderCreated;
use App\Jobs\ExponentPushJob;
use App\Jobs\SendAssignationWebsocketJob;
use App\Jobs\SendOrderWebsocketJob;

class OrderCreatedListener
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
     * @param OrderCreated $event
     * @return void
     */
    public function handle(OrderCreated $event)
    {
        // Send to Websocket server
        dispatch(new SendOrderWebsocketJob($event->order, Event::CREATE));

        if ($event->order->user !== null) {
            // If user assigned: send to user's websocket
            dispatch(new SendAssignationWebsocketJob($event->order, $event->order->user_id, Event::CREATE));

            // If expo token exists: send push notification
            if ($event->order->user->expo_token !== null) {
                dispatch(new ExponentPushJob($event->order->user, trans('notifications.order_number') . $event->order->number, trans('notifications.new_assignment')));
            }
        }
    }

}
