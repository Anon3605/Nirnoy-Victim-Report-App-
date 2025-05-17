<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\PanicController;
use App\Http\Controllers\PanicStreamController;
use App\Http\Controllers\EmergencyInfoController;
use App\Http\Controllers\EmergencyController;
use App\Http\Controllers\Api\CommunityController;
use App\Models\User;


Route::post('/user-profile', function (Request $request) {
    $user = User::where('email', $request->email)->first();

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    return response()->json($user);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Panic alert route
Route::post('/panic', [PanicController::class, 'store']);
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('/user-profile', [AuthController::class, 'userProfile']);
Route::post('/save-emergency-info', [AuthController::class, 'saveEmergencyInfo']);

// Route::post('/save-emergency-info', [EmergencyInfoController::class, 'store']);
Route::post('/get-emergency-info', [EmergencyInfoController::class, 'get']);
Route::post('/get-emergency-info', [EmergencyController::class, 'getEmergencyInfo']);
Route::post('/store-panic', [PanicController::class, 'store']);
Route::get('/latest-panic/{name}', [PanicController::class, 'getLatestPanic']);
Route::get('/latest-panic/{name}', [PanicController::class, 'latest']);
Route::get('/panic-stream/{victimName}', [PanicStreamController::class, 'stream']);
Route::get('/stream-latest-panic/{name}', [PanicController::class, 'streamLatestPanic']);
Route::get('/latest-panic/{victimName}', [\App\Http\Controllers\Api\PanicController::class, 'latestPanic']);
Route::get('/community', [CommunityController::class, 'index']);
Route::post('/community', [CommunityController::class, 'store']);
Route::delete('/community/{id}', [CommunityController::class, 'destroy']);
