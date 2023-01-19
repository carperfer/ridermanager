<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Laravel\Lumen\Routing\Controller as BaseController;

class Controller extends BaseController
{
    /**
     * Name of the function that checks company and permission in PermissionPolicy
     */
    const PERMISSION_POLICY = 'checkCompanyPermission';

    protected Request  $request;
    protected ?Company $company;

    public function __construct(Request $request)
    {
        $this->request = trim_attr($request);
        $this->company = $this->request->company_id !== null ? Company::getByField('id', $this->request->company_id) : null;
    }

}
