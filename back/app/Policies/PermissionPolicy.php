<?php

namespace App\Policies;

use App\Models\Company;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PermissionPolicy
{
    use HandlesAuthorization;

    protected bool $response = true;

    /**
     * Determine whether the users have a certain permission in a company they belong.
     *
     * @param \App\Models\User    $user
     * @param \App\Models\Company $company
     * @param string              $ability
     * @return bool
     */
    public function checkCompanyPermission(User $user, Company $company, string $ability = ''): bool
    {
        // Check whether the user belongs to the company and has the given permission
        if (!$user->userBelongsCompany($company->id) || ($ability !== '' && !$this->userHasPermission($user, $company, $ability))) {
            $this->response = false;
        }

        return $this->response;
    }

    /**
     * @param \App\Models\User    $user
     * @param \App\Models\Company $company
     * @param string              $ability
     * @return bool
     */
    private function userHasPermission(User $user, Company $company, string $ability): bool
    {
        $role = $user->roles()->wherePivot('company_id', '=', $company->id)->first();
        $permissions = $role->permissions()->pluck('name')->toArray();

        return in_array($ability, $permissions);
    }

}
