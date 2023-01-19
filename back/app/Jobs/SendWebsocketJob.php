<?php

namespace App\Jobs;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

abstract class SendWebsocketJob extends Job
{
    protected string $realtimeHost;
    protected int    $realtimePort;
    protected string $realtimeToken;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->realtimeHost = config('global.realtime.host');
        $this->realtimePort = config('global.realtime.port');
        $this->realtimeToken = config('global.realtime.token');
        $this->afterCommit = true;
    }

    /**
     * Send the HTTP request to the realtime microservice
     *
     * @param string $target
     * @param mixed  $model
     * @param string $action
     */
    protected function sendWebsocket(string $target, mixed $model, string $action)
    {
        try {
            // Log error and end process if RealTime host is not defined
            if ($this->realtimeHost === '') {
                Log::alert('No RealTime host defined!');
                return;
            }

            // Make request
            $response = Http::withHeaders(['content-type' => 'application/json', 'x-api-key' => $this->realtimeToken])->post(
                $this->realtimeHost . ':' . $this->realtimePort . '/message',
                ['target' => $target, 'model' => $model, 'action' => $action]
            );

            // Check response status and log alert if it is not OK
            if ($response->status() !== 200) {
                Log::error($response->body());
            }
        } catch (\Exception $exception) {
            Log::error($exception->getMessage());
            Log::error($exception->getTraceAsString());
        }
    }

}
