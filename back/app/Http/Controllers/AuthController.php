<?php

namespace App\Http\Controllers;

use App\Models\PasswordReset;
use App\Models\Role;
use App\Models\User;
use App\Rules\CompanyRules;
use App\Rules\UserRules;
use App\Services\CompanyService;
use App\Services\UserService;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Facades\JWTFactory;

class AuthController extends Controller
{
    private UserService    $userService;
    private CompanyService $companyService;

    public function __construct(Request $request, UserService $userService, CompanyService $companyService)
    {
        parent::__construct($request);

        $this->userService = $userService;
        $this->companyService = $companyService;
    }

    /**
     * @return JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Throwable
     */
    public function register(): JsonResponse
    {
        $this->validate($this->request, UserRules::createRules());
        $this->validate($this->request, CompanyRules::rules());

        $db = DB::connection();
        $db->beginTransaction();

        try {
            // Get admin role
            $role = Role::getByField('name', Role::ADMIN_ROLE);

            // Create company
            $company = $this->companyService->create($this->request->only('name'));
            $company->save();

            // Create user with company and role
            $user = $this->userService->create($this->request->all());
            $user->save();
            $user->companies()->attach($company->id, ['role_id' => $role->id]);

            $db->commit();
        } catch (\Throwable $e) {
            $db->rollBack();
            throw $e;
        }

        return response()->json($user, 201);
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Illuminate\Auth\AuthenticationException
     */
    public function login(): JsonResponse
    {
        $this->validate($this->request, UserRules::loginRules());

        if (!auth()->validate($this->request->only('email', 'password'))) {
            throw new AuthenticationException;
        }

        // Get user and add remember_token as custom claim
        $user = User::getByField('email', $this->request->email);
        $payload = JWTFactory::sub($user->id)->claims(['rbt' => $user->remember_token])->make();

        // Create token
        $token = (string)JWTAuth::encode($payload);

        return response()->json($this->userService->issueAccessToken($token));
    }

    /**
     * @return JsonResponse
     */
    public function logout(): JsonResponse
    {
        auth()->logout();
        return response()->json([]);
    }

    /**
     * @return JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Throwable
     */
    public function forgot(): JsonResponse
    {
        $this->validate($this->request, UserRules::forgotPwdRules());

        $db = DB::connection();
        $db->beginTransaction();

        try {
            $user = User::getByField('email', $this->request->email);
            $pwdReset = $this->userService->addPasswordReset();
            $pwdReset->user()->associate($user);
            $pwdReset->save();

            $db->commit();
        } catch (\Throwable $e) {
            $db->rollBack();
            throw $e;
        }
        return response()->json([]);
    }

    /**
     * @param string $token
     * @return JsonResponse
     */
    public function viewReset(string $token): JsonResponse
    {
        $pwdReset = PasswordReset::getByField('token', $token);
        $pwdReset->user;

        return response()->json($pwdReset);
    }

    /**
     * @return JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Throwable
     */
    public function reset(): JsonResponse
    {
        $this->validate($this->request, UserRules::resetPwdRules());

        $db = DB::connection();
        $db->beginTransaction();

        try {
            $pwdReset = PasswordReset::getByField('token', $this->request->token);
            $user = $this->userService->editCredentials($pwdReset->user, $this->request->only('password'));
            $user->save();
            PasswordReset::where('user_id', '=', $user->id)->delete();

            $db->commit();
        } catch (\Throwable $e) {
            $db->rollBack();
            throw $e;
        }

        return response()->json([]);
    }

}
