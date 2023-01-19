<?php

namespace App\Events;

use App\Models\User;

class UserUpdated extends Event
{
    public User   $user;
    public string $action;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(User $user, string $action)
    {
        $this->user = $user;
        $this->action = $action;
    }

}
