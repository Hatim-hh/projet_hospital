<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Medecin extends Model
{
    protected $table = 'medecins';
    protected $primaryKey = 'id_medecin';

    protected $fillable = [
        'numero_ordre', 'nom', 'prenom', 'id_specialite',
        'telephone', 'email', 'tarif_consultation'
    ];

    public function specialite()
    {
        return $this->belongsTo(Specialite::class, 'id_specialite', 'id_specialite');
    }

    public function rendezVous()
    {
        return $this->hasMany(RendezVous::class, 'id_medecin', 'id_medecin');
    }

    public function consultations()
    {
        return $this->hasMany(Consultation::class, 'id_medecin', 'id_medecin');
    }
}