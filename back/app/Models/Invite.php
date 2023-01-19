<?php

namespace App\Models;

use App\Exceptions\ExceptionSlugs;
use App\Observers\InviteObserver;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class Invite extends BaseModel
{
    use InviteObserver;

    protected $fillable = [
        'email',
        'token',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'email', 'email');
    }

    /**
     * Check if the email already has an invitation in the company.
     *
     * @param string $email
     * @param int    $companyId
     * @throws \Exception
     */
    public static function checkUserInvited(string $email, int $companyId)
    {
        // Check whether the email has been already invited
        if ((new static)::where('email', '=', $email)->where('company_id', '=', $companyId)->exists()) {
            throw new ConflictHttpException(ExceptionSlugs::USER_INVITED);
        }
    }

}
