<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\RendezVous;
use App\Models\Consultation;
use App\Models\Patient;
use App\Models\Medecin;

class RendezVousConsultationSeeder extends Seeder
{
    public function run(): void
    {
        $patients = Patient::all();
        $medecins = Medecin::all();

        // Create Sample Rendez-Vous
        RendezVous::create([
            'id_patient' => $patients[0]->id_patient ?? 1,
            'id_medecin' => $medecins[0]->id_medecin ?? 1,
            'date_heure' => now()->addDays(2)->setTime(10, 30),
            'duree_minutes' => 30,
            'motif' => 'Consultation générale',
            'statut' => 'confirme'
        ]);

        RendezVous::create([
            'id_patient' => $patients[1]->id_patient ?? 2,
            'id_medecin' => $medecins[1]->id_medecin ?? 2,
            'date_heure' => now()->addDays(3)->setTime(14, 00),
            'duree_minutes' => 45,
            'motif' => 'Suivi cardiologique',
            'statut' => 'en_attente'
        ]);

        RendezVous::create([
            'id_patient' => $patients[2]->id_patient ?? 3,
            'id_medecin' => $medecins[2]->id_medecin ?? 3,
            'date_heure' => now()->addDays(5)->setTime(11, 15),
            'duree_minutes' => 30,
            'motif' => 'Consultation dermatologique',
            'statut' => 'confirme'
        ]);

        // Create Sample Consultations
        Consultation::create([
            'id_patient' => $patients[0]->id_patient ?? 1,
            'id_medecin' => $medecins[0]->id_medecin ?? 1,
            'date_consultation' => now()->subDays(1),
            'motif' => 'Consultation générale',
            'diagnostic' => 'Patient en bonne santé générale',
            'examen_clinique' => 'Examen clinique normal',
            'observations' => 'Suivi annuel recommandé. Tension artérielle: 120/80, pouls: 72 bpm',
            'tension' => '120/80',
            'poids' => 75.5,
            'temperature' => 36.8
        ]);

        Consultation::create([
            'id_patient' => $patients[1]->id_patient ?? 2,
            'id_medecin' => $medecins[1]->id_medecin ?? 2,
            'date_consultation' => now()->subDays(2),
            'motif' => 'Suivi post-opératoire',
            'diagnostic' => 'Suivi post-opératoire - Cicatrisation normale',
            'examen_clinique' => 'Cicatrice en bonne voie de cicatrisation',
            'observations' => 'Pas d\'infection détectée. Antibiotiques à continuer pour 3 jours. Pansement à renouveler',
            'tension' => '118/76',
            'poids' => 62.0,
            'temperature' => 37.0
        ]);

        Consultation::create([
            'id_patient' => $patients[2]->id_patient ?? 3,
            'id_medecin' => $medecins[2]->id_medecin ?? 3,
            'date_consultation' => now()->subDays(5),
            'motif' => 'Consultation dermatologique',
            'diagnostic' => 'Allergie cutanée confirmée',
            'examen_clinique' => 'Éruption cutanée localisée sur les bras',
            'observations' => 'Prescription d\'une crème apaisante. Éviter exposition au soleil. Revoir dans 1 semaine',
            'tension' => '122/80',
            'poids' => 70.0,
            'temperature' => 36.6
        ]);

        Consultation::create([
            'id_patient' => $patients[0]->id_patient ?? 1,
            'id_medecin' => $medecins[1]->id_medecin ?? 2,
            'date_consultation' => now()->subDays(7),
            'motif' => 'Urgent - Douleurs abdominales',
            'diagnostic' => 'Gastro-entérite aiguë',
            'examen_clinique' => 'Douleurs à la palpation épigastrique',
            'observations' => 'Prescrire antalgiques et antiémétiques. Suivi urgent à 48h. Scanner abdominal si persistance des symptômes',
            'tension' => '125/82',
            'poids' => 74.5,
            'temperature' => 38.2
        ]);
    }
}
