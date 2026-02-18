<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Patient;
use App\Models\DossierMedical;

class PatientSeeder extends Seeder
{
    public function run(): void
    {
        // Create 3 Sample Patients
        $patient1 = Patient::create([
            'numero_dossier' => 'P000001',
            'nom' => 'Amrani',
            'prenom' => 'Mohammed',
            'date_naissance' => '1985-05-15',
            'sexe' => 'M',
            'telephone' => '0623456789',
            'adresse' => '45 Rue Mohammed V, Casablanca',
            'email' => 'mohammed.amrani@email.com',
            'groupe_sanguin' => 'O+',
            'situation_familiale' => 'Marié'
        ]);

        $patient2 = Patient::create([
            'numero_dossier' => 'P000002',
            'nom' => 'Berrada',
            'prenom' => 'Amal',
            'date_naissance' => '1990-08-22',
            'sexe' => 'F',
            'telephone' => '0634567890',
            'adresse' => '12 Avenue Hassan II, Rabat',
            'email' => 'amal.berrada@email.com',
            'groupe_sanguin' => 'A+',
            'situation_familiale' => 'Célibataire'
        ]);

        $patient3 = Patient::create([
            'numero_dossier' => 'P000003',
            'nom' => 'Chahid',
            'prenom' => 'Youssef',
            'date_naissance' => '1978-03-10',
            'sexe' => 'M',
            'telephone' => '0645678901',
            'adresse' => '78 Boulevard Zerktouni, Casablanca',
            'email' => 'youssef.chahid@email.com',
            'groupe_sanguin' => 'B+',
            'situation_familiale' => 'Marié'
        ]);

        // Create medical files
        DossierMedical::create([
            'id_patient' => $patient1->id_patient,
            'antecedents_medicaux' => 'Diabète type 2',
            'allergies' => 'Pénicilline',
            'maladies_chroniques' => 'Diabète, Hypertension'
        ]);

        DossierMedical::create([
            'id_patient' => $patient2->id_patient,
            'antecedents_medicaux' => 'Aucun',
            'allergies' => 'Aucune',
            'maladies_chroniques' => 'Aucune'
        ]);

        DossierMedical::create([
            'id_patient' => $patient3->id_patient,
            'antecedents_medicaux' => 'Asthme',
            'allergies' => 'Pollen',
            'maladies_chroniques' => 'Asthme'
        ]);
    }
}
