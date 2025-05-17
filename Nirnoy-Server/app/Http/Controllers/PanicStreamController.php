<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PanicStreamController extends Controller
{
    public function stream($victimName)
    {
        return response()->stream(function () use ($victimName) {
            // Your streaming logic here
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
        ]);
    }
}
