<?php

namespace App\Models;

use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Model;
try {
    class Panicked extends Model
    {
        protected $table = 'panicked';
        protected $fillable = [
            'user_id',
            'latitude',
            'longitude',
            'created_at',
        ];

        public $timestamps = false; // Optional if you manually set created_at
    }

    $panic = new Panic();
    $panic->user_id = $user->id;
    $panic->latitude = $request->latitude;
    $panic->longitude = $request->longitude;
    $panic->created_at = now();
    $panic->save();

    // Save to Panicked table (for 10-minute window)
    $panicked = new Panicked();
    $panicked->user_id = $user->id;
    $panicked->latitude = $request->latitude;
    $panicked->longitude = $request->longitude;
    $panicked->created_at = now();
    $panicked->save();
    $panicked->save();
} catch (\Exception $e) {
    Log::error('Panicked save error: ' . $e->getMessage());
}



