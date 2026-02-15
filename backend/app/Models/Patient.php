<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $table = 'patients';
    protected $primaryKey = 'id_patient';

    protected $fillable = [
        'numero_dossier', 'nom', 'prenom', 'date_naissance',
        'sexe', 'telephone', 'adresse', 'email',
        'groupe_sanguin', 'situation_familiale'
    ];

    protected $casts = ['date_naissance' => 'date'];

    public function dossierMedical()
    {
        return $this->hasOne(DossierMedical::class, 'id_patient', 'id_patient');
    }

    public function rendezVous()
    {
        return $this->hasMany(RendezVous::class, 'id_patient', 'id_patient');
    }

    public function consultations()
    {
        return $this->hasMany(Consultation::class, 'id_patient', 'id_patient');
    }
}