<?php

namespace App\Services;

use App\Models\Company;
use App\Models\Invite;
use App\Models\Role;
use App\Models\User;
use Exception;
use Illuminate\Support\Str;

class InviteService
{
    /**
     * @param array $data
     * @return \App\Models\Invite
     */
    public function create(array $data): Invite
    {
        $invite = new Invite($data);
        $invite->token = (string)Str::uuid();

        return $invite;
    }

}
