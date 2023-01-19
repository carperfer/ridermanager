<?php

namespace App\Mail;

use App\Models\Company;
use App\Models\Invite;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InviteMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public Invite $invite;

    public function __construct(Invite $invite)
    {
        $this->invite = $invite;
        $this->afterCommit = true;
    }

    public function build()
    {
        return $this->from(config('mail.from.address'), config('mail.from.name'))
            ->subject(config('mail.subject.invite'))
            ->view('mails.invite');
    }

}
