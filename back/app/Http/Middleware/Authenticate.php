<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Factory as Auth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

class Authenticate
{
    /**
     * The authentication guard factory instance.
     *
     * @var \Illuminate\Contracts\Auth\Factory
     */
    protected $auth;

    /**
     * Create a new middleware instance.
     *
     * @param \Illuminate\Contracts\Auth\Factory $auth
     * @return void
     */
    public function __construct(Auth $auth)
    {
        $this->auth = $auth;
    }

    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure                 $next
     * @param string|null              $guard
     * @return mixed
     * @throws \Tymon\JWTAuth\Exceptions\TokenInvalidException
     * @throws \Tymon\JWTAuth\Exceptions\JWTException
     */
    public function handle($request, Closure $next, $guard = null): mixed
    {
        // If no authentication
        if ($this->auth->guard($guard)->guest()) {
            if ($guard === 'api') {
                throw new TokenInvalidException();
            }
            throw new JWTException();
        }

        // If authenticated by user: check remember token
        if ($guard !== 'api') {
            $payload = JWTAuth::parseToken()->getPayload();
            if ($payload->get('rbt') !== $this->auth->user()->getRememberToken()) {
                throw new JWTException();
            }
        }

        return $next($request);
    }

}
