<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Panic;
use App\Models\Panicked;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class PanicController extends Controller
{
    public function store(Request $request)
    {
        Log::info('PANIC API HIT', $request->all());

        $request->validate([
            'email' => 'required|email',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            Log::error('User not found: ' . $request->email);
            return response()->json(['message' => 'User not found'], 404);
        }

        try {
            // Store in panics table
            $panic = new Panic();
            $panic->user_id = $user->id;
            $panic->latitude = $request->latitude;
            $panic->longitude = $request->longitude;
            $panic->created_at = now();
            $panic->save();

            // Store in panickeds table
            $panicked = new Panicked();
            $panicked->user_id = $user->id;
            $panicked->latitude = $request->latitude;
            $panicked->longitude = $request->longitude;
            $panicked->created_at = now();
            $panicked->save();

            // Cleanup old data
            Panicked::where('created_at', '<', now()->subMinutes(10))->delete();

            Log::info("Panic saved for user: {$user->email}");

            return response()->json(['message' => 'Panic alert saved successfully']);
        } catch (\Exception $e) {
            Log::error('PANIC SAVE ERROR: ' . $e->getMessage());
            return response()->json(['message' => 'Internal server error'], 500);
        }
    }

    // 🔴 NEW: SSE Endpoint for streaming panic location updates
    // public function panicStream($name)
    // {
    //     $user = User::where('name', $name)->first();
    //     if (!$user) {
    //         return response('User not found', 404);
    //     }

    //     header('Content-Type: text/event-stream');
    //     header('Cache-Control: no-cache');
    //     header('Connection: keep-alive');

    //     // Set output buffering to immediately flush data
    //     while (true) {
    //         $latestPanic = Panic::where('user_id', $user->id)
    //                             ->latest()
    //                             ->first();

    //         if ($latestPanic && now()->diffInMinutes($latestPanic->created_at) < 20) {
    //             echo "data: " . json_encode([
    //                 'latitude' => $latestPanic->latitude,
    //                 'longitude' => $latestPanic->longitude,
    //                 'timestamp' => $latestPanic->created_at->toDateTimeString()
    //             ]) . "\n\n";
    //         } else {
    //             echo "data: {}\n\n";
    //         }
    //         echo "data: {}\n\n";
    //         ob_flush();
    //         flush();
    //         sleep(3); // Poll every 3 seconds
    //     }
    // }
    public function latestPanic($victimName)
    {
        $user = User::where('name', $victimName)->first();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $panic = Panic::where('user_id', $user->id)->latest()->first();

        if ($panic && now()->diffInMinutes($panic->created_at) < 20) {
            return response()->json([
                'latitude' => $panic->latitude,
                'longitude' => $panic->longitude,
                'timestamp' => $panic->created_at->toDateTimeString(),
            ]);
        }

        return response()->json([]);
    }

}

