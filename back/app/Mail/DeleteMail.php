<?php

namespace App\Mail;

use App\Models\Company;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class DeleteMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public Company $company;
    public User $user;

    public function __construct(Company $company, User $user)
    {
        $this->company = $company;
        $this->user = $user;
        $this->afterCommit = true;
    }

    public function build()
    {
        return $this->from(config('mail.from.address'), config('mail.from.name'))
            ->subject(config('mail.subject.delete'))
            ->view('mails.delete');
    }

}
