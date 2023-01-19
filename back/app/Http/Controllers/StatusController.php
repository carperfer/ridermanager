<?php


namespace App\Http\Controllers;


use App\Models\Status;
use Illuminate\Http\JsonResponse;

class StatusController extends Controller
{
    /**
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return response()->json(Status::all());
    }
}
