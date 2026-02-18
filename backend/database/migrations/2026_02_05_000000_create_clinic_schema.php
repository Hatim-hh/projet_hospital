<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('specialites', function (Blueprint $table) {
            $table->id('id_specialite');
            $table->string('nom_specialite', 100);
            $table->text('description')->nullable();
        });

        Schema::create('patients', function (Blueprint $table) {
            $table->id('id_patient');
            $table->string('numero_dossier', 50)->unique()->index();
            $table->string('nom', 100);
            $table->string('prenom', 100);
            $table->date('date_naissance');
            $table->enum('sexe', ['M', 'F']);
            $table->string('telephone', 20)->nullable();
            $table->text('adresse')->nullable();
            $table->string('email', 100)->nullable();
            $table->string('groupe_sanguin', 5)->nullable();
            $table->string('situation_familiale', 50)->nullable();
            $table->timestamps();
        });

        Schema::create('dossiers_medicaux', function (Blueprint $table) {
            $table->id('id_dossier');
            $table->unsignedBigInteger('id_patient')->unique();
            $table->text('antecedents_medicaux')->nullable();
            $table->text('antecedents_chirurgicaux')->nullable();
            $table->text('allergies')->nullable();
            $table->text('maladies_chroniques')->nullable();
            $table->text('traitements_cours')->nullable();
            $table->timestamp('derniere_maj')->useCurrent()->useCurrentOnUpdate();
            $table->foreign('id_patient')->references('id_patient')->on('patients')->onDelete('cascade');
        });

        Schema::create('medecins', function (Blueprint $table) {
            $table->id('id_medecin');
            $table->string('numero_ordre', 50)->unique();
            $table->string('nom', 100);
            $table->string('prenom', 100);
            $table->unsignedBigInteger('id_specialite');
            $table->string('telephone', 20)->nullable();
            $table->string('email', 100)->nullable();
            $table->decimal('tarif_consultation', 10, 2)->nullable();
            $table->timestamps();
            $table->foreign('id_specialite')->references('id_specialite')->on('specialites');
        });

        Schema::create('rendez_vous', function (Blueprint $table) {
            $table->id('id_rdv');
            $table->unsignedBigInteger('id_patient');
            $table->unsignedBigInteger('id_medecin');
            $table->dateTime('date_heure');
            $table->integer('duree_minutes')->default(30);
            $table->string('motif', 255)->nullable();
            $table->enum('statut', ['confirme', 'en_attente', 'annule', 'termine'])->default('en_attente');
            $table->timestamps();
            $table->index('date_heure');
            $table->foreign('id_patient')->references('id_patient')->on('patients')->onDelete('cascade');
            $table->foreign('id_medecin')->references('id_medecin')->on('medecins')->onDelete('cascade');
        });

        Schema::create('consultations', function (Blueprint $table) {
            $table->id('id_consultation');
            $table->unsignedBigInteger('id_patient');
            $table->unsignedBigInteger('id_medecin');
            $table->unsignedBigInteger('id_rdv')->nullable();
            $table->dateTime('date_consultation');
            $table->string('motif', 255)->nullable();
            $table->text('examen_clinique')->nullable();
            $table->string('diagnostic', 255)->nullable();
            $table->text('observations')->nullable();
            $table->decimal('poids', 5, 2)->nullable();
            $table->string('tension', 20)->nullable();
            $table->decimal('temperature', 4, 2)->nullable();
            $table->timestamps();
            $table->index('date_consultation');
            $table->foreign('id_patient')->references('id_patient')->on('patients')->onDelete('cascade');
            $table->foreign('id_medecin')->references('id_medecin')->on('medecins')->onDelete('cascade');
            $table->foreign('id_rdv')->references('id_rdv')->on('rendez_vous')->onDelete('set null');
        });

        Schema::create('medicaments', function (Blueprint $table) {
            $table->id('id_medicament');
            $table->string('nom_commercial', 255);
            $table->string('dci', 255)->nullable();
            $table->string('forme', 100)->nullable();
            $table->string('dosage', 100)->nullable();
        });

        Schema::create('actes_medicaux', function (Blueprint $table) {
            $table->id('id_acte');
            $table->unsignedBigInteger('id_consultation');
            $table->string('code_acte', 20)->nullable();
            $table->string('libelle', 255);
            $table->decimal('tarif', 10, 2);
            $table->foreign('id_consultation')->references('id_consultation')->on('consultations')->onDelete('cascade');
        });

        Schema::create('ordonnances', function (Blueprint $table) {
            $table->id('id_ordonnance');
            $table->unsignedBigInteger('id_consultation');
            $table->dateTime('date_ordonnance');
            $table->text('recommandations')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->foreign('id_consultation')->references('id_consultation')->on('consultations')->onDelete('cascade');
        });

        Schema::create('lignes_ordonnances', function (Blueprint $table) {
            $table->id('id_ligne');
            $table->unsignedBigInteger('id_ordonnance');
            $table->unsignedBigInteger('id_medicament');
            $table->string('posologie', 255);
            $table->integer('duree_jours')->nullable();
            $table->foreign('id_ordonnance')->references('id_ordonnance')->on('ordonnances')->onDelete('cascade');
            $table->foreign('id_medicament')->references('id_medicament')->on('medicaments');
        });

        Schema::create('assurances', function (Blueprint $table) {
            $table->id('id_assurance');
            $table->string('nom_assurance', 255);
            $table->string('telephone', 20)->nullable();
            $table->string('email', 100)->nullable();
            $table->decimal('taux_couverture', 5, 2)->nullable();
        });

        Schema::create('factures', function (Blueprint $table) {
            $table->id('id_facture');
            $table->unsignedBigInteger('id_consultation');
            $table->unsignedBigInteger('id_patient');
            $table->unsignedBigInteger('id_assurance')->nullable();
            $table->string('numero_facture', 50)->unique();
            $table->decimal('montant_total', 10, 2);
            $table->decimal('part_assurance', 10, 2)->default(0);
            $table->decimal('part_patient', 10, 2);
            $table->decimal('montant_paye', 10, 2)->default(0);
            $table->enum('statut', ['en_attente', 'partiel', 'paye'])->default('en_attente');
            $table->dateTime('date_emission');
            $table->timestamps();
            $table->foreign('id_consultation')->references('id_consultation')->on('consultations')->onDelete('cascade');
            $table->foreign('id_patient')->references('id_patient')->on('patients')->onDelete('cascade');
            $table->foreign('id_assurance')->references('id_assurance')->on('assurances')->onDelete('set null');
        });

        Schema::create('paiements', function (Blueprint $table) {
            $table->id('id_paiement');
            $table->unsignedBigInteger('id_facture');
            $table->decimal('montant', 10, 2);
            $table->enum('mode_paiement', ['especes', 'carte', 'cheque', 'virement']);
            $table->dateTime('date_paiement');
            $table->string('reference', 100)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->foreign('id_facture')->references('id_facture')->on('factures')->onDelete('cascade');
        });

        Schema::create('stock', function (Blueprint $table) {
            $table->id('id_stock');
            $table->unsignedBigInteger('id_medicament');
            $table->integer('quantite');
            $table->decimal('prix_unitaire', 10, 2)->nullable();
            $table->date('date_expiration')->nullable();
            $table->integer('seuil_alerte')->default(10);
            $table->timestamp('derniere_maj')->useCurrent()->useCurrentOnUpdate();
            $table->foreign('id_medicament')->references('id_medicament')->on('medicaments')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock');
        Schema::dropIfExists('paiements');
        Schema::dropIfExists('factures');
        Schema::dropIfExists('lignes_ordonnances');
        Schema::dropIfExists('ordonnances');
        Schema::dropIfExists('actes_medicaux');
        Schema::dropIfExists('consultations');
        Schema::dropIfExists('rendez_vous');
        Schema::dropIfExists('dossiers_medicaux');
        Schema::dropIfExists('medecins');
        Schema::dropIfExists('patients');
        Schema::dropIfExists('specialites');
        Schema::dropIfExists('medicaments');
        Schema::dropIfExists('assurances');
    }
};
