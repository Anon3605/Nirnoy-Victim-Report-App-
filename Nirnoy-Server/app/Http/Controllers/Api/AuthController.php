<?php

namespace App\Http\Controllers\Api;
use App\Models\Emergency as Emergency;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User; // This is the correct User model


class AuthController extends Controller
{
    public function register(Request $request)
        {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:6'
            ]);

            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password)
            ]);

            return response()->json(['message' => 'User registered successfully'], 201);
        }

    public function login(Request $request)
        {
            $credentials = $request->validate([
                'email' => ['required','email'],
                'password' => ['required'],
            ]);

            if (!Auth::attempt($credentials)) {
                return response()->json(['message' => 'Invalid credentials'], 401);
            }

            $user = Auth::user();

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user,
            ]);
        }

    public function userProfile(Request $request)
        {
            $user = User::where('email', $request->email)->first();

            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            return response()->json([
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone, // Add phone if exists in DB
            ]);
        }

    public function saveEmergencyInfo(Request $request)
        {
            $request->validate([
                'email' => 'required|email',
                'emergency_phone' => 'required|string',
                'emergency_message' => 'nullable|string',
            ]);

            $user = User::where('email', $request->email)->first();

            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            $emergency = Emergency::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'emergency_phone' => $request->emergency_phone,
                    'emergency_message' => $request->emergency_message,
                ]
            );

            return response()->json(['message' => 'Emergency info saved successfully']);
        }


}
