<?php

namespace App\Observers;

use App\Mail\InviteMail;
use Illuminate\Support\Facades\Mail;

trait InviteObserver
{
    protected static function boot()
    {
        parent::boot();

        static::created(function ($invite) {
            Mail::to($invite)->queue(new InviteMail($invite));
        });
    }
}
