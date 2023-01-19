<?php

namespace App\Jobs;

use App\Models\Order;

class SendAssignationWebsocketJob extends SendWebsocketJob
{
    protected Order  $order;
    protected string $target;
    protected string $action;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Order $order, int $userId, string $action)
    {
        parent::__construct();
        $this->target = 'assignations:' . $userId;
        $this->order = $order;
        $this->action = $action;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $this->sendWebsocket($this->target, $this->order, $this->action);
    }

}
