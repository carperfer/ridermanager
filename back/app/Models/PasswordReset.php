<?php

namespace App\Models;

use App\Observers\PasswordResetObserver;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PasswordReset extends BaseModel
{
    use HasFactory, PasswordResetObserver;

    protected $fillable = ['token'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
