<?php

namespace App\Jobs;

use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ExponentPushJob extends Job
{
    private string $endpoint;
    private string $sound;
    private User   $user;
    private string $title;
    private string $message;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(User $user, string $title, string $message)
    {
        $this->endpoint = config('global.expo_push_url');
        $this->sound = 'default';

        $this->user = $user;
        $this->title = $title;
        $this->message = $message;

        $this->afterCommit = true;
    }

    /**
     * Execute the job.
     *
     * @return void
     * @throws \Throwable
     */
    public function handle()
    {
        try {
            // Send request to Exponent
            $response = Http::withHeaders(['content-type' => 'application/json'])->post(
                $this->endpoint,
                ['to' => $this->user->expo_token, 'title' => $this->title, 'body' => $this->message, 'sound' => $this->sound]
            );
            // Read response and check status
            $data = $response->json('data');
            if ($data !== null && $data['status'] === 'error') {
                // Log error if it reaches the max number of attempts
                if ($this->attempts() >= $this->tries) {
                    Log::alert(json_encode($data));
                }
                // Delay the next attempt
                $this->release($this->retryAfter);
            }
        } catch (\Exception $exception) {
            Log::error($exception->getMessage());
            Log::error($exception->getTraceAsString());
        }
    }

}
