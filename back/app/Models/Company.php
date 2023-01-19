<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Eloquent\SoftDeletes;

class Company extends BaseModel
{
    use SoftDeletes, HasFactory;

    protected $fillable = ['name'];
    protected $hidden   = ['verified'];

    public function customers()
    {
        return $this->hasMany(Customer::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'users_companies_roles')->withPivot(['role_id'])->whereNull(User::USERS_COMPANIES_ROLES . '.deleted_at')->withTimestamps();
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function invites()
    {
        return $this->hasMany(Invite::class);
    }

    /**
     * @param int|null $id
     * @return \App\Models\User|null
     */
    public function getUserFromCompany(?int $id): ?User
    {
        if ($id === null) {
            return null;
        }

        $user = $this->users()->where('id', '=', $id)->first();

        if (!$user) {
            throw new ModelNotFoundException('model_user');
        }

        return $user;
    }

    /**
     * @param int|null $id
     * @return \App\Models\Customer|null
     */
    public function getCustomerFromCompany(?int $id = null): ?Customer
    {
        return $this->customers()->where('id', '=', $id)->first();
    }

}
