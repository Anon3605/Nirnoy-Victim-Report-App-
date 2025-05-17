<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Panic extends Model
{
    protected $fillable = ['user_id', 'latitude', 'longitude', 'created_at'];
    public $timestamps = false;
}

