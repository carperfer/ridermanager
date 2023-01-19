<?php

namespace App\Events;

use App\Models\Order;

class OrderDeleted extends Event
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