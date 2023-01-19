<?php

namespace App\Models;

use App\Exceptions\ExceptionSlugs;
use App\Observers\UserObserver;
use Carbon\Carbon;
use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Cache;
use Laravel\Lumen\Auth\Authorizable;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends BaseModel implements AuthenticatableContract, AuthorizableContract, JWTSubject
{
    use Authenticatable, Authorizable, HasFactory, SoftDeletes, UserObserver;

    const USERS_COMPANIES_ROLES = 'users_companies_roles';
    protected $fillable = [
        'email',
        'first_name',
        'last_name',
        'phone',
    ];

    protected $hidden = ['password', 'remember_token', 'expo_token'];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function location()
    {
        return $this->hasOne(UserLocation::class);
    }

    public function roles(bool $excludeTrashed = true)
    {
        $roles = $this->belongsToMany(Role::class, self::USERS_COMPANIES_ROLES)
            ->withPivot(['company_id', 'user_id'])
            ->withTimestamps();
        if ($excludeTrashed) {
            $roles = $roles->whereNull(self::USERS_COMPANIES_ROLES . '.deleted_at');
        }

        return $roles;
    }

    public function companies(bool $excludeTrashed = true)
    {
        $companies = $this->belongsToMany(Company::class, self::USERS_COMPANIES_ROLES)
            ->withPivot(['role_id'])
            ->withTimestamps();
        if ($excludeTrashed) {
            $companies = $companies->whereNull(self::USERS_COMPANIES_ROLES . '.deleted_at');
        }

        return $companies;
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    /**
     * @param int   $companyId
     * @param array $filters
     * @return mixed
     */
    public static function getWithFilters(int $companyId, array $filters): mixed
    {
        // Apply company filter by default
        $users = (new static())::whereHas('companies', function ($query) use ($companyId) {
            return $query->where('company_id', '=', $companyId);
        });
        // Check filters are fillable attributes
        foreach ($filters as $filter => $value) {
            if (in_array($filter, (new User())->getFillable())) {
                $users = $users->where($filter, '=', $value);
            }
        }
        return $users->get();
    }

    /**
     * Get the status of the user
     */
    public function getStatusAndLocation()
    {
        $this->online = $this->location !== null;
    }

    /**
     * @param \App\Models\Company $company
     * @param int                 $userId
     * @return \App\Models\User
     */
    public static function getUserByCompany(Company $company, int $userId): User
    {
        $user = $company->users()->where('id', '=', $userId)->first();

        if (!$user) {
            throw new ModelNotFoundException('model_user');
        }

        return $user;
    }

    /**
     * Verify the email does not exist for another user.
     *
     * @param \App\Models\User $user
     * @param string|null      $email
     */
    public static function checkFreeEmail(User $user, ?string $email)
    {
        if ($email && (new static())::where('email', '=', $email)->where('id', '!=', $user->id)->exists()) {
            throw new BadRequestException(ExceptionSlugs::EXISTING_EMAIL);
        }
    }

    /**
     * Check if the user is not already registered in the given company.
     *
     * @param string $email
     * @param int    $companyId
     */
    public static function checkExistsInCompany(string $email, int $companyId)
    {
        // Check whether the email is already registered in that company
        $user = (new static)::where('email', '=', $email)->first();
        if ($user && $user->userBelongsCompany($companyId)) {
            throw new ConflictHttpException(ExceptionSlugs::USER_EXISTS_COMPANY);
        }
    }

    /**
     * @return array
     */
    public function getCompaniesList(): array
    {
        return $this->companies()->pluck('id')->toArray();
    }

    /**
     * @param $companyId
     * @return bool
     */
    public function userBelongsCompany($companyId): bool
    {
        return in_array($companyId, $this->getCompaniesList());
    }

    /**
     * @param int $companyId
     */
    public function deleteFromCompany(int $companyId)
    {
        $this->companies()->updateExistingPivot($companyId, ['deleted_at' => Carbon::now()]);
    }

    /**
     * @param int $companyId
     */
    public function enableOnCompany(int $companyId)
    {
        $this->companies()->updateExistingPivot($companyId, ['deleted_at' => null]);
    }

    /**
     * @param int $companyId
     */
    public function detachOrdersAssigned(int $companyId)
    {
        $this->orders()->where('company_id', '=', $companyId)->update(['user_id' => null]);
    }

    /**
     * @param array $filters
     * @return mixed
     */
    public function getOrdersAssignedWithFilters(array $filters = []): mixed
    {
        $orders = $this->orders()->with(['company', 'status']);

        if (isset($filters['pickup_after'])) {
            $orders = $orders->where('pickup_at', '>=', $filters['pickup_after']);
        }
        if (isset($filters['deliver_before'])) {
            $orders = $orders->where('deliver_at', '<', $filters['deliver_before']);
        }

        return $orders->get();
    }

    /**
     * @param int $companyId
     * @return \App\Models\Company
     */
    public function getCompanyInfo(int $companyId): Company
    {
        return $this->companies()->where('id', '=', $companyId)->first();
    }

    /**
     * Return the list of companies the user belongs to, with roles and permissions.
     */
    public function getCompanyWithRolesAndPermissions()
    {
        foreach ($this->companies as $company) {
            $role = $this->roles()->wherePivot('company_id', '=', $company->id)->first();
            $permissions = $this->getPermissionsInfo($company->id);
            $company->role = $role;
            $company->role->permissions = $permissions;
            unset($company->pivot);
            unset($role->pivot);
        }
    }

    /**
     * @param $companyId
     * @return array
     */
    public function getPermissionsInfo($companyId): array
    {
        $role = $this->roles()->wherePivot('company_id', '=', $companyId)->first();

        return $role->permissions()->pluck('name')->toArray();
    }

}
