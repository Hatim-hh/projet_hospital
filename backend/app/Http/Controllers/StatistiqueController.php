<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\RendezVous;
use App\Models\Consultation;
use Illuminate\Http\Request;

class StatistiqueController extends Controller
{
    public function dashboard()
    {
        return response()->json([
            'total_patients' => Patient::count(),
            'rdv_aujourdhui' => RendezVous::whereDate('date_heure', today())->count(),
            'consultations_mois' => Consultation::whereMonth('date_consultation', now()->month)->count(),
            'revenu_mois' => 45000
        ]);
    }
}
