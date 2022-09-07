<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//    return $request->user();
//});
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('logout', [\App\Http\Controllers\Agent\Api\AgentController::class, 'logout']);
    Route::prefix('reservation')->group(function () {
        Route::post('', [\App\Http\Controllers\Agent\Api\AgentController::class, 'store']);
        Route::post('duplicate/{trip}', [\App\Http\Controllers\Agent\Api\AgentController::class, 'duplicate']);
        Route::get('', [\App\Http\Controllers\Agent\Api\AgentController::class, 'index']);
        Route::delete('{trip?}', [\App\Http\Controllers\Agent\Api\AgentController::class, 'destroy']);
        Route::put('{trip}', [\App\Http\Controllers\Agent\Api\AgentController::class, 'update']);

    });

});
Route::post('login', [\App\Http\Controllers\Agent\Api\AgentController::class, 'login']);
