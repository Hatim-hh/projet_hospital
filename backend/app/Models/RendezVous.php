<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RendezVous extends Model
{
    protected $table = 'rendez_vous';
    protected $primaryKey = 'id_rdv';

    protected $fillable = [
        'id_patient', 'id_medecin', 'date_heure',
        'duree_minutes', 'motif', 'statut'
    ];

    protected $casts = ['date_heure' => 'datetime'];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'id_patient', 'id_patient');
    }

    public function medecin()
    {
        return $this->belongsTo(Medecin::class, 'id_medecin', 'id_medecin');
    }
}