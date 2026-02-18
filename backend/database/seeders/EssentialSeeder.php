<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Specialite;
use App\Models\Medecin;
use App\Models\User;

class EssentialSeeder extends Seeder
{
    public function run(): void
    {
        // Create Specialites
        Specialite::create(['nom_specialite' => 'Médecine Générale', 'description' => 'Consultation générale et suivi médical']);
        Specialite::create(['nom_specialite' => 'Cardiologie', 'description' => 'Spécialiste du cœur et du système cardiovasculaire']);
        Specialite::create(['nom_specialite' => 'Dermatologie', 'description' => 'Spécialiste de la peau']);
        Specialite::create(['nom_specialite' => 'Pédiatrie', 'description' => 'Médecine des enfants']);
        Specialite::create(['nom_specialite' => 'Gynécologie', 'description' => 'Santé de la femme']);

        // Create Doctors
        Medecin::create([
            'numero_ordre' => 'MED001',
            'nom' => 'Bennani',
            'prenom' => 'Ahmed',
            'id_specialite' => 1,
            'telephone' => '0612345678',
            'email' => 'ahmed.bennani@clinique.ma',
            'tarif_consultation' => 300.00
        ]);

        Medecin::create([
            'numero_ordre' => 'MED002',
            'nom' => 'Alami',
            'prenom' => 'Fatima',
            'id_specialite' => 2,
            'telephone' => '0612345679',
            'email' => 'fatima.alami@clinique.ma',
            'tarif_consultation' => 500.00
        ]);

        Medecin::create([
            'numero_ordre' => 'MED003',
            'nom' => 'Tazi',
            'prenom' => 'Karim',
            'id_specialite' => 3,
            'telephone' => '0612345680',
            'email' => 'karim.tazi@clinique.ma',
            'tarif_consultation' => 400.00
        ]);

        // Create Users (password = password)
        User::create([
            'email' => 'admin@clinique.ma',
            'password' => bcrypt('password'),
            'role' => 'admin'
        ]);

        User::create([
            'email' => 'accueil@clinique.ma',
            'password' => bcrypt('password'),
            'role' => 'accueil'
        ]);

        User::create([
            'email' => 'ahmed.bennani@clinique.ma',
            'password' => bcrypt('password'),
            'role' => 'medecin',
            'id_medecin' => 1
        ]);
    }
}
