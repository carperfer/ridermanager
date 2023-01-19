<?php

namespace App\Listeners;

use App\Events\Event;
use App\Events\OrderUpdated;
use App\Jobs\ExponentPushJob;
use App\Jobs\SendAssignationWebsocketJob;
use App\Jobs\SendOrderIntegrationJob;
use App\Jobs\SendOrderWebsocketJob;

class OrderUpdatedListener
{
    protected OrderUpdated $event;

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
     * @param OrderUpdated $event
     * @return void
     */
    public function handle(OrderUpdated $event)
    {
        $this->event = $event;

        // Send to real-time microservice for Company
        dispatch(new SendOrderWebsocketJob($this->event->order, Event::UPDATE));

        // Check whether it must push a notification and/or a message to the user's websocket
        if ($this->event->order->user !== null) {
            // Order has a user assigned: check changes to send or not a notification
            $this->handleUserNotifications();
        }

        // Handle integration
        if ($this->event->order->integration && $this->event->order->isDirty('status_id')) {
            dispatch(new SendOrderIntegrationJob($this->event->order));
        }
    }

    /**
     * Handle cases to send or not different notifications to users
     */
    private function handleUserNotifications()
    {
        if ($this->event->order->isDirty('user_id')) {
            $this->sendExpoNotification(trans('notifications.new_assignment', [], 'es'));
            $this->sendWebsocketEvent($this->event->order->user_id, Event::CREATE);

            // Send DELETE to old user if exists
            if ($this->event->order->getOriginal('user_id') !== null) {
                $this->sendWebsocketEvent($this->event->order->getOriginal('user_id'), Event::DELETE);
            }
        } else {
            if ($this->shouldNotifyUpdate()) {
                // User did not change but order was updated: notify user
                $this->sendExpoNotification(trans('notifications.order_updated', [], 'es'));
            }
            $this->sendWebsocketEvent($this->event->order->user_id, Event::UPDATE);
        }
    }

    /**
     * Dispatch ExponentPushJob with the given message.
     *
     * @param string $message
     */
    private function sendExpoNotification(string $message)
    {
        // User changed: notify new assignment
        dispatch(
            new ExponentPushJob(
                $this->event->order->user,
                trans('notifications.order_number', ['number' => $this->event->order->number], 'es'),
                $message
            )
        );
    }

    /**
     * Dispatch Job to send order to user's websocket queue.
     *
     * @param int    $userId
     * @param string $action
     */
    private function sendWebsocketEvent(int $userId, string $action)
    {
        dispatch(new SendAssignationWebsocketJob($this->event->order, $userId, $action));
    }

    /**
     * Check certain values have changed in order to know whether it should send a notification.
     *
     * @return bool
     */
    private function shouldNotifyUpdate(): bool
    {
        return $this->event->order->isDirty('pickup_info')
            || $this->event->order->isDirty('delivery_info')
            || $this->event->order->isDirty('pickup_at')
            || $this->event->order->isDirty('deliver_at');
    }

}
