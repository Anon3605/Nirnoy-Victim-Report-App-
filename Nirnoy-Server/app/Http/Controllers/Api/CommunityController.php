<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Community;
use Illuminate\Http\Request;

class CommunityController extends Controller
{
    public function index()
    {
        return response()->json(Community::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'embed_utube_link' => 'required|url'
        ]);

        $video = Community::create($request->all());

        return response()->json($video, 201);
    }

    public function destroy($id)
    {
        $video = Community::findOrFail($id);
        $video->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }
}

