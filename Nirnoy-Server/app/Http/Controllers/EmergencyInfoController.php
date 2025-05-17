<?php

namespace App\Http\Controllers;

use App\Models\Emergency;
use App\Models\User;
use Illuminate\Http\Request;

class EmergencyInfoController extends Controller
{
    public function store(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $info = Emergency::updateOrCreate(
            ['user_id' => $user->id],
            [
                'emergency_phone' => $request->emergency_phone,
                'emergency_message' => $request->emergency_message,
            ]
        );

        return response()->json(['message' => 'Emergency info saved successfully']);
    }

    public function get(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $info = Emergency::where('user_id', $user->id)->first();

        if (!$info) {
            return response()->json(['message' => 'No emergency info found'], 404);
        }

        return response()->json([
            'emergency_phone' => $info->emergency_phone,
            'emergency_message' => $info->emergency_message,
        ]);
    }
}
