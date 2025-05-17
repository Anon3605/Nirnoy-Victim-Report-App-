<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Emergency;
use App\Models\User;

class EmergencyController extends Controller
{
    public function getEmergencyInfo(Request $request)
    {
        $email = $request->input('email');

        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $emergency = Emergency::where('user_id', $user->id)->first();
        if (!$emergency) {
            return response()->json(['message' => 'Emergency info not found'], 404);
        }

        return response()->json([
            'emergency_phone' => $emergency->emergency_phone,
            'emergency_message' => $emergency->emergency_message,
        ]);
    }
}
