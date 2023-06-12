<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;

// print current user
Route::middleware('auth:sanctum')->get('/user', function (Request $request){
    return $request->user();
});

// user API's
Route::post('register',[AuthController::class,'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// product API's
Route::get('products', [ProductController::class, 'getProducts'])->middleware('auth:sanctum');
Route::get('products/{id}', [ProductController::class, 'viewProduct'])->middleware('auth:sanctum');
Route::put('products/{id}', [ProductController::class, 'updateProduct'])->middleware('auth:sanctum');
Route::post('products', [ProductController::class, 'createProduct'])->middleware('auth:sanctum');
Route::delete('products/{id}', [ProductController::class, 'deleteProduct'])->middleware('auth:sanctum');
