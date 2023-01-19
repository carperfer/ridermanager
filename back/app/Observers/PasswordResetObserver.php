<?php

namespace App\Observers;

use App\Mail\ForgotPasswordMail;
use Illuminate\Support\Facades\Mail;

trait PasswordResetObserver
{
    protected static function boot()
    {
        parent::boot();

        static::created(function ($pwdReset) {
            Mail::to($pwdReset->user)->queue(new ForgotPasswordMail($pwdReset->user, $pwdReset));
        });
    }
}
