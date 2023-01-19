<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Invite;
use App\Models\Role;
use App\Models\User;
use App\Rules\InviteRules;
use App\Services\InviteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InviteController extends Controller
{
    private InviteService $inviteService;

    public function __construct(Request $request, InviteService $inviteService)
    {
        parent::__construct($request);

        $this->inviteService = $inviteService;
    }

    /**
     * @return JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function index(): JsonResponse
    {
        $this->validate($this->request, InviteRules::filtersRules());

        $company = Company::getByField('id', $this->request->company_id);
        $this->authorize(self::PERMISSION_POLICY, [$company, 'manage-invites']);

        return response()->json($company->invites);
    }

    /**
     * @param string $token
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(string $token): JsonResponse
    {
        // Get company by UUID as this function is not middlewared
        $invite = Invite::getByField('token', $token);

        // Add relations
        $invite->company;
        $invite->user;
        $invite->role;

        return response()->json($invite);
    }

    /**
     * @return JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Illuminate\Auth\Access\AuthorizationException
     * @throws \Throwable
     */
    public function store(): JsonResponse
    {
        $this->validate($this->request, InviteRules::rules());

        $db = DB::connection();
        $db->beginTransaction();

        try {
            // Get role and company
            $role = Role::getByField('id', $this->request->role_id);

            // Check the requesting user has permission in the company
            $this->authorize(self::PERMISSION_POLICY, [$this->company, 'manage-invites']);
            // Plus, verify the user does not already exist in the company or has already an invitation
            Invite::checkUserInvited($this->request->email, $this->company->id);
            User::checkExistsInCompany($this->request->email, $this->company->id);

            // Create invite
            $invite = $this->inviteService->create($this->request->all());
            $invite->company()->associate($this->company);
            $invite->role()->associate($role);
            $invite->save();

            $db->commit();
        } catch (\Throwable $e) {
            $db->rollBack();
            throw $e;
        }
        return response()->json($invite, 201);
    }

    /**
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function destroy(int $id): JsonResponse
    {
        $invite = Invite::getByField('id', $id);
        $this->authorize(self::PERMISSION_POLICY, [$invite->company, 'manage-invites']);
        $invite->delete();

        return response()->json([]);
    }

}
