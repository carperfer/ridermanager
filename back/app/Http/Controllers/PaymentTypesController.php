<?php

namespace App\Http\Controllers;

use App\Models\PaymentType;
use Illuminate\Http\JsonResponse;

class PaymentTypesController extends Controller
{
    /**
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return response()->json(PaymentType::all());
    }
}
