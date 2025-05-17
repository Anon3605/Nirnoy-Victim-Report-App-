<?php
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\Community;

Route::get('/admin/community', function () {
    $videos = Community::all();
    return view('community_admin', compact('videos'));
});

Route::post('/admin/community', function (Request $request) {
    $request->validate([
        'title' => 'required|string',
        'embed_utube_link' => 'required|url',
    ]);
    Community::create($request->only(['title', 'embed_utube_link']));
    return redirect('/admin/community');
});

Route::delete('/admin/community/{id}', function ($id) {
    Community::findOrFail($id)->delete();
    return redirect('/admin/community');
});
