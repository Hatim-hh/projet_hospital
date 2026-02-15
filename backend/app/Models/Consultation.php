<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Consultation extends Model
{
    protected $table = 'consultations';
    protected $primaryKey = 'id_consultation';

    protected $fillable = [
        'id_patient', 'id_medecin', 'id_rdv', 'date_consultation',
        'motif', 'examen_clinique', 'diagnostic', 'observations',
        'poids', 'tension', 'temperature'
    ];

    protected $casts = ['date_consultation' => 'datetime'];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'id_patient', 'id_patient');
    }

    public function medecin()
    {
        return $this->belongsTo(Medecin::class, 'id_medecin', 'id_medecin');
    }
}