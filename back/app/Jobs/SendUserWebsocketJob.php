<?php

namespace App\Jobs;

use App\Models\User;

class SendUserWebsocketJob extends SendWebsocketJob
{
    protected User   $user;
    protected string $target;
    protected string $action;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(User $user, string $action)
    {
        parent::__construct();
        $this->user = $user;
        $this->action = $action;
        $this->target = '';
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // Get location of user if online
        $this->user->getStatusAndLocation();

        foreach ($this->user->companies as $company) {
            $this->target = 'users:' . $company->id;
            unset($this->user->companies);
            $this->sendWebsocket($this->target, $this->user, $this->action);
        }
    }

}
