<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Models\Emergency;
use App\Models\Panicked;
use App\Models\User;
use App\Models\Panic; // You also need to import this model

class PanicController extends Controller
{
    public function store(Request $request)
    {
        Log::info('PANIC REQUEST RECEIVED', $request->all()); // Debug

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            Log::error('User not found for email: ' . $request->email); // Not Working
            return response()->json(['message' => 'User not found'], 404);
        }

        try {
            $panic = new Panic();
            $panic->user_id = $user->id;
            $panic->latitude = $request->latitude;
            $panic->longitude = $request->longitude;
            $panic->created_at = now();
            $panic->save();

            $panicked = new Panicked();
            $panicked->user_id = $user->id;
            $panicked->latitude = $request->latitude;
            $panicked->longitude = $request->longitude;
            $panicked->created_at = now();
            $panicked->save();

            Panicked::where('created_at', '<', now()->subMinutes(10))->delete();

            Log::info('Panic stored successfully for user: ' . $user->email); // Working

            return response()->json(['message' => 'Panic saved successfully']);
        } catch (\Exception $e) {
            Log::error('PANIC SAVE ERROR: ' . $e->getMessage()); // 🔴
            return response()->json(['message' => 'Internal server error'], 500);
        }
    }


    public function getLatestPanic($name)
    {
        $user = User::where('name', $name)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $panic = Panic::where('user_id', $user->id)
                    ->latest()
                    ->first();

        if (!$panic) {
            return response()->json(['message' => 'No panic data found'], 404);
        }

        return response()->json([
            'latitude' => $panic->latitude,
            'longitude' => $panic->longitude,
        ]);
    }

}