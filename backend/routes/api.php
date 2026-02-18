<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\RendezVousController;
use App\Http\Controllers\ConsultationController;
use App\Http\Controllers\StatistiqueController;

Route::post('/login', [LoginController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::get('/user', [LoginController::class, 'user']);
    Route::apiResource('patients', PatientController::class);
    Route::apiResource('rendez-vous', RendezVousController::class);
    Route::apiResource('consultations', ConsultationController::class);
    Route::get('/statistiques/dashboard', [StatistiqueController::class, 'dashboard']);
});

Route::get('/test', function () {
    return response()->json(['message' => 'API fonctionnelle']);
});