<?php

namespace App\Exceptions;

class ExceptionSlugs
{
    const BAD_REQUEST         = 'bad_request';
    const EXISTING_EMAIL      = 'existing_email';
    const FORBIDDEN           = 'forbidden';
    const GENERIC_CONFLICT    = 'generic_conflict';
    const GENERIC_ERROR       = 'generic_error';
    const INVALID_API_TOKEN   = 'invalid_api_token';
    const NOT_FOUND           = 'not_found';
    const UNAUTHORIZED        = 'unauthorized';
    const USER_EXISTS_COMPANY = 'user_exists_company';
    const USER_INVITED        = 'user_invited';
    const VALIDATION          = 'validation';
    const WRONG_CREDENTIALS   = 'wrong_credentials';

}
