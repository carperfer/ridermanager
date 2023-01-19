<?php

namespace App\Jobs;

use App\Models\Order;

class SendOrderIntegrationJob extends Job
{
    public Order     $order;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
        $this->afterCommit = true;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $name = self::INTEGRATION_NAMESPACE . $this->order->integration->client->integration->name;
        $integration = new $name($this->order->integration->client);
        $integration->updateStatus($this->order);
    }

}
