<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Emergency;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, HasFactory;

    // Add this if you want to allow mass assignment
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone', // if you're storing phone numbers
    ];

    public function emergency()
    {
        return $this->hasOne(Emergency::class);
    }
}



