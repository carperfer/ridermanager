<?php

namespace App\Mail;

use App\Models\PasswordReset;
use App\Models\User;
use App\Observers\PasswordResetObserver;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ForgotPasswordMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels, PasswordResetObserver;

    public PasswordReset $pwdReset;
    public User $user;

    public function __construct(User $user, PasswordReset $pwdReset)
    {
        $this->user = $user;
        $this->pwdReset = $pwdReset;
        $this->afterCommit = true;
    }

    public function build()
    {
        return $this->from(config('mail.from.address'), config('mail.from.name'))
            ->subject(config('mail.subject.reset'))
            ->view('mails.reset');
    }

}
