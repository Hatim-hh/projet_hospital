<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Specialite extends Model
{
    protected $table = 'specialites';
    protected $primaryKey = 'id_specialite';
    public $timestamps = false;
    protected $fillable = ['nom_specialite', 'description'];
}