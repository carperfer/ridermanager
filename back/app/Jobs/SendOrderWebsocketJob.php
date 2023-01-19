<?php

namespace App\Jobs;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SendOrderWebsocketJob extends SendWebsocketJob
{
    protected Order  $order;
    protected string $target;
    protected string $action;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Order $order, string $action)
    {
        parent::__construct();
        $this->order = $order;
        $this->target = 'orders:' . $order->company_id;
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
