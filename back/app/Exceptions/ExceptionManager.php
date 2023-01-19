<?php

namespace App\Exceptions;

class ExceptionManager
{
    private \Throwable $exception;

    public function __construct(\Throwable $exception)
    {
        $this->exception = $exception;
    }

    /**
     * @return array
     */
    public function authException(): array
    {
        return $this->bodyBase(ExceptionSlugs::UNAUTHORIZED, 401, $this->exception->getMessage());
    }

    /**
     * @return array
     */
    public function loginException(): array
    {
        return $this->bodyBase(ExceptionSlugs::WRONG_CREDENTIALS, 401, 'Credentials are not valid');
    }

    /**
     * @return array
     */
    public function apiTokenException(): array
    {
        return $this->bodyBase(ExceptionSlugs::INVALID_API_TOKEN, 401, 'API Token is not valid');
    }

    /**
     * @return array
     */
    public function notFoundException(): array
    {
        $slug = explode('_', $this->exception->getMessage());

        if (count($slug) > 1) {
            if ($slug[0] === 'attr') {
                $response = $this->bodyBase($this->exception->getMessage(), 404, 'Attribute not found:' . $slug[1]);
            } elseif ($slug[0] === 'model') {
                $response = $this->bodyBase($this->exception->getMessage(), 404, 'Model not found:' . $slug[1]);
            } else {
                $response = $this->bodyBase(ExceptionSlugs::NOT_FOUND, 404, $this->exception->getMessage());
            }
        } else {
            $response = $this->bodyBase(ExceptionSlugs::NOT_FOUND, 404, $this->exception->getMessage());
        }

        return $response;
    }

    /**
     * @return array
     */
    public function wrongRoute(): array
    {
        return $this->bodyBase('route', 404, 'Route not found');
    }

    /**
     * @return array
     */
    public function genericException(): array
    {
        return $this->bodyBase(ExceptionSlugs::GENERIC_ERROR, 500, config('global.app_debug') ? $this->exception->getMessage() : 'Unexpected error, please contact CoverManager');
    }

    /**
     * @return array
     */
    public function validationException(): array
    {
        return $this->bodyBase(ExceptionSlugs::VALIDATION, 422, $this->exception->getResponse()->getOriginalContent());
    }

    /**
     * @return array
     */
    public function badRequestException(): array
    {
        $slug = $this->exception->getMessage();

        if ($slug === ExceptionSlugs::EXISTING_EMAIL) {
            $response = $this->bodyBase($slug, 400, 'Email is already taken');
        } else {
            $response = $this->bodyBase(ExceptionSlugs::BAD_REQUEST, 400, 'Bad request. Please, review your request');
        }

        return $response;
    }

    /**
     * @return array
     */
    public function forbiddenException(): array
    {
        return $this->bodyBase(ExceptionSlugs::FORBIDDEN, 403, $this->exception->getMessage());
    }

    /**
     * @return array
     */
    public function conflictException(): array
    {
        $slug = $this->exception->getMessage();

        if ($slug === ExceptionSlugs::USER_EXISTS_COMPANY) {
            $response = $this->bodyBase($slug, 409, 'User already exists in this company');
        } elseif ($slug === ExceptionSlugs::USER_INVITED) {
            $response = $this->bodyBase($slug, 409, 'User already has an invitation for this company');
        } else {
            $response = $this->bodyBase(ExceptionSlugs::GENERIC_CONFLICT, 409, 'There was an unexpected conflict. Please, review your request');
        }

        return $response;
    }

    /**
     * @param string       $error
     * @param int          $code
     * @param string|array $message
     * @return array
     */
    private function bodyBase(string $error, int $code, string|array $message): array
    {
        return [
            'error'   => $error,
            'code'    => $code,
            'message' => $message,
        ];
    }

}
