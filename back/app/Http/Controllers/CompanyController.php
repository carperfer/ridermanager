<?php

namespace App\Http\Controllers;

use App\Mail\DeleteMail;
use App\Models\Company;
use App\Models\Role;
use App\Rules\CompanyRules;
use App\Services\CompanyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class CompanyController extends Controller
{
    private CompanyService $companyService;

    public function __construct(Request $request, CompanyService $companyService)
    {
        parent::__construct($request);

        $this->companyService = $companyService;
    }

    /**
     * @param int $id
     * @return JsonResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function show(int $id): JsonResponse
    {
        // Get company and check the user belongs to it
        $company = Company::getByField('id', $id);
        $this->authorize(self::PERMISSION_POLICY, $company);

        return response()->json($company);
    }

    /**
     * @return JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Throwable
     */
    public function store(): JsonResponse
    {
        $this->validate($this->request, CompanyRules::rules());

        $db = DB::connection();
        $db->beginTransaction();

        try {
            // Create company
            $company = $this->companyService->create($this->request->only('name'));
            $company->save();

            // Add user to new company as admin
            $role = Role::getByField('name', Role::ADMIN_ROLE);
            $this->request->user()->companies()->attach($company->id, ['role_id' => $role->id]);

            // Add roles and permissions to response
            $company->role = $role;
            $company->role->permissions = $role->permissions()->pluck('name')->toArray();

            $db->commit();
        } catch (\Throwable $e) {
            $db->rollBack();
            throw $e;
        }

        return response()->json($company, 201);
    }

    /**
     * @param int $id
     * @return JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function update(int $id): JsonResponse
    {
        $this->validate($this->request, CompanyRules::rules());
        // Get company and check the user has permission to edit before applying changes
        $company = Company::getByField('id', $id);
        $this->authorize(self::PERMISSION_POLICY, [$company, 'manage-company']);
        $this->companyService->edit($company, $this->request->only(['name']));
        $company->save();

        return response()->json($company);
    }

    /**
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     * @throws \Throwable
     */
    public function destroy(int $id): JsonResponse
    {
        $db = DB::connection();
        $db->beginTransaction();

        try {
            // Get company and check the user has managing permissions here
            $company = Company::getByField('id', $id);
            $this->authorize(self::PERMISSION_POLICY, [$company, 'manage-company']);

            // Delete users from company and notify them
            $company->users()->each(function ($user) use ($company) {
                $user->deleteFromCompany($company->id);
                Mail::to($user)->queue(new DeleteMail($company, $user));
            });
            $company->delete();

            $db->commit();
        } catch (\Throwable $e) {
            $db->rollBack();
            throw $e;
        }

        return response()->json([]);
    }

}
