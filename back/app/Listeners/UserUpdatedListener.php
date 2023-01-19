<?php

namespace App\Listeners;

use App\Events\UserUpdated;
use App\Jobs\SendLocationIntegrationJob;
use App\Jobs\SendUserWebsocketJob;

class UserUpdatedListener
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
     * @param UserUpdated $event
     * @return void
     */
    public function handle(UserUpdated $event)
    {
        $user = clone $event->user;

        // Send to Websocket server
        dispatch(new SendUserWebsocketJob($user, $event->action));

        // Check whether rider has active location, and send to integration if so
//        if (!empty($user->location)) {
//            dispatch(new SendLocationIntegrationJob($user));
//        }
    }

}
