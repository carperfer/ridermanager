<?php

namespace App\Events;

use App\Models\Order;

class OrderUpdated extends Event
{
    public Order $order;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
    }
}
