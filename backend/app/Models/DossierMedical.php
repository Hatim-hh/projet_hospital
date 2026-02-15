<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DossierMedical extends Model
{
    protected $table = 'dossiers_medicaux';
    protected $primaryKey = 'id_dossier';
    public $timestamps = false;

    protected $fillable = [
        'id_patient', 'antecedents_medicaux', 'antecedents_chirurgicaux',
        'allergies', 'maladies_chroniques', 'traitements_cours'
    ];
}