<?php

namespace App\Jobs;

use App\Models\Status;
use App\Models\User;

class SendLocationIntegrationJob extends Job
{
    /**
     * @var \App\Models\User
     */
    protected User $user;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(User $user)
    {
        $this->user = $user;
        $this->afterCommit = true;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $this->user->getStatusAndLocation();

        // Get orders with status Delivering
        $ordersDelivering = $this->user->getOrdersAssignedWithFilters(['status_id' => (Status::getByField('name', Status::DELIVERING_STATUS))->id]);
        foreach ($ordersDelivering as $order) {
            // Send location to integration service of each order if exists
            if ($order->integration) {
                $name = self::INTEGRATION_NAMESPACE . $order->integration->client->integration->name;
                $integration = new $name($order->integration->client);
                $integration->updateDriverLocation($order, $this->user->location);
            }
        }
    }

}
