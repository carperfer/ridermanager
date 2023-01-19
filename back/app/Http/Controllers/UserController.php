<?php

namespace App\Http\Controllers;

use App\Exceptions\ExceptionSlugs;
use App\Mail\DeleteMail;
use App\Models\Invite;
use App\Models\User;
use App\Models\UserLocation;
use App\Rules\InviteRules;
use App\Rules\UserRules;
use App\Services\UserService;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Facades\JWTFactory;

class UserController extends Controller
{
    private UserService $userService;

    public function __construct(Request $request, UserService $userService)
    {
        parent::__construct($request);
        $this->userService = $userService;
    }

    /**
     * @return JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function index(): JsonResponse
    {
        $this->validate($this->request, UserRules::filtersRules());
        $this->authorize(self::PERMISSION_POLICY, $this->company);

        $users = User::getWithFilters($this->request->company_id, $this->request->except('company_id'));

        // Add status and location
        $users->each(
            function ($user) {
                return $user->getStatusAndLocation();
            }
        );

        return response()->json($users->toArray());
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Throwable
     */
    public function store(): JsonResponse
    {
        $this->validate($this->request, InviteRules::tokenRules());

        $db = DB::connection();
        $db->beginTransaction();

        try {
            $invite = Invite::getByField('token', $this->request->token);
            $user = $this->storeAndGetInvitedUser($invite);

            $invite->delete();

            $db->commit();
        } catch (ConflictHttpException $e) {
            // This Exception is thrown when user exists in company, and it is enabled:
            // It is needed to delete the invitation to avoid the error to happen again,
            // and then, trigger the exception to show the message in JSON response.
            $invite->delete();
            $db->commit();
            throw $e;
        } catch (\Throwable $e) {
            $db->rollBack();
            throw $e;
        }

        return response()->json($user, 201);
    }

    /**
     * @return JsonResponse
     * @throws \Exception
     */
    public function update(): JsonResponse
    {
        $this->validate($this->request, UserRules::editRules());

        // Get user and verify the email is free before editing
        $user = $this->request->user();
        User::checkFreeEmail($user, $this->request->email);
        $this->userService->edit($this->request->user(), $this->request->except('password'));
        $user->save();

        return response()->json($user);
    }

    /**
     * @throws \Illuminate\Auth\AuthenticationException
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Throwable
     */
    public function updateCredentials(): JsonResponse
    {
        $this->validate($this->request, UserRules::updatePwdRules());

        $db = DB::connection();
        $db->beginTransaction();

        try {
            $user = $this->userService->editCredentials($this->request->user(), $this->request->all());
            $user->save();
            $payload = JWTFactory::sub($user->id)->claims(['rbt' => $user->remember_token])->make();
            // Create new token
            $token = (string)JWTAuth::encode($payload);

            $db->commit();
        } catch (\Throwable $e) {
            $db->rollBack();
            throw $e;
        }

        return response()->json($this->userService->issueAccessToken($token));
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function getLoggedUser(): JsonResponse
    {
        $user = $this->request->user();
        $user->getCompanyWithRolesAndPermissions();

        return response()->json($user);
    }

    /**
     * @param int $id
     * @return JsonResponse
     * @throws \Throwable
     */
    public function destroy(int $id): JsonResponse
    {
        $this->validate($this->request, UserRules::companyIdRules());
        $this->authorize(self::PERMISSION_POLICY, [$this->company, 'manage-users']);

        $db = DB::connection();
        $db->beginTransaction();

        try {
            // Get user and delete from company
            $user = User::getUserByCompany($this->company, $id);
            $user->deleteFromCompany($this->request->company_id);

            // Detach orders
            $user->detachOrdersAssigned($this->request->company_id);

            Mail::to($user)->queue(new DeleteMail($this->company, $user));

            $db->commit();
        } catch (\Throwable $e) {
            $db->rollBack();
            throw $e;
        }

        return response()->json([]);
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Throwable
     */
    public function bulkDestroy(): JsonResponse
    {
        $this->validate($this->request, UserRules::bulkDeleteRules());
        $this->authorize(self::PERMISSION_POLICY, [$this->company, 'manage-users']);

        $db = DB::connection();
        $db->beginTransaction();

        try {
            // Get users who belong to the company (excluding the requesting user)
            $users = $this->company->users()
                ->whereIn('id', $this->request->users_id)
                ->where('id', '!=', $this->request->user()->id)
                ->get();
            $users->each(
                function ($user) {
                    $user->deleteFromCompany($this->company->id);
                    $user->detachOrdersAssigned($this->company->id);
                    Mail::to($user)->queue(new DeleteMail($this->company, $user));
                }
            );

            $db->commit();
        } catch (\Throwable $e) {
            $db->rollBack();
            throw $e;
        }

        return response()->json([]);
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function storeLocation(): JsonResponse
    {
        $this->validate($this->request, UserRules::locationRules());

        $location = $this->request->user()->location === null
            ? $this->userService->createLocation($this->request->user(), $this->request->all())
            : $this->userService->editLocation($this->request->user()->location, $this->request->all());
        $location->save();

        return response()->json([]);
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroyLocation(): JsonResponse
    {
        $location = UserLocation::getByField('user_id', $this->request->user()->id);
        $location->delete();
        return response()->json([]);
    }

    /**
     * @param \App\Models\Invite $invite
     * @return \App\Models\User
     * @throws \Illuminate\Auth\AuthenticationException
     * @throws \Illuminate\Validation\ValidationException
     */
    private function storeAndGetInvitedUser(Invite $invite): User
    {
        // User exists: check companies and state
        if ($invite->user) {
            if (!auth()->validate(['email' => $invite->user->email, 'password' => $this->request->password])) {
                throw new AuthenticationException;
            }
            if ($invite->user->companies()->wherePivot('company_id', '=', $invite->company_id)->exists()) {
                // User exists in company, and it is enabled: delete invite and throw error
                $invite->delete();
                throw new ConflictHttpException(ExceptionSlugs::USER_EXISTS_COMPANY);
            } elseif ($invite->user->companies(false)->wherePivot('company_id', '=', $invite->company_id)->exists()) {
                // User exists in company, and it is disabled: enable back
                $invite->user->enableOnCompany($invite->company_id);
                $invite->user->save();
            } else {
                // User exists but not in company: attach to company
                $invite->user->companies()->attach($invite->company_id, ['role_id' => $invite->role_id]);
            }

            return $invite->user;
        }

        // User does not exist: create it
        $this->validate($this->request, UserRules::createRules());
        $user = $this->userService->create($this->request->all());
        $user->save();
        $user->companies()->attach($invite->company_id, ['role_id' => $invite->role_id]);

        return $user;
    }

}
