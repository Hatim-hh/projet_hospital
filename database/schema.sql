-- Schema complet de la base de données
CREATE DATABASE IF NOT EXISTS clinique_medicale CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE clinique_medicale;

DROP TABLE IF EXISTS paiements;
DROP TABLE IF EXISTS factures;
DROP TABLE IF EXISTS lignes_ordonnances;
DROP TABLE IF EXISTS ordonnances;
DROP TABLE IF EXISTS actes_medicaux;
DROP TABLE IF EXISTS consultations;
DROP TABLE IF EXISTS rendez_vous;
DROP TABLE IF EXISTS stock;
DROP TABLE IF EXISTS dossiers_medicaux;
DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS medecins;
DROP TABLE IF EXISTS specialites;
DROP TABLE IF EXISTS medicaments;
DROP TABLE IF EXISTS assurances;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS migrations;
DROP TABLE IF EXISTS personal_access_tokens;

CREATE TABLE users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'medecin', 'accueil', 'infirmier', 'comptable', 'direction') NOT NULL,
    id_medecin INT NULL,
    id_patient INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE patients (
    id_patient INT AUTO_INCREMENT PRIMARY KEY,
    numero_dossier VARCHAR(50) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    date_naissance DATE NOT NULL,
    sexe ENUM('M', 'F') NOT NULL,
    telephone VARCHAR(20),
    adresse TEXT,
    email VARCHAR(100),
    groupe_sanguin VARCHAR(5),
    situation_familiale VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_numero_dossier (numero_dossier)
);

CREATE TABLE dossiers_medicaux (
    id_dossier INT AUTO_INCREMENT PRIMARY KEY,
    id_patient INT UNIQUE NOT NULL,
    antecedents_medicaux TEXT,
    antecedents_chirurgicaux TEXT,
    allergies TEXT,
    maladies_chroniques TEXT,
    traitements_cours TEXT,
    derniere_maj TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_patient) REFERENCES patients(id_patient) ON DELETE CASCADE
);

CREATE TABLE specialites (
    id_specialite INT AUTO_INCREMENT PRIMARY KEY,
    nom_specialite VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE medecins (
    id_medecin INT AUTO_INCREMENT PRIMARY KEY,
    numero_ordre VARCHAR(50) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    id_specialite INT NOT NULL,
    telephone VARCHAR(20),
    email VARCHAR(100),
    tarif_consultation DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_specialite) REFERENCES specialites(id_specialite)
);

CREATE TABLE rendez_vous (
    id_rdv INT AUTO_INCREMENT PRIMARY KEY,
    id_patient INT NOT NULL,
    id_medecin INT NOT NULL,
    date_heure DATETIME NOT NULL,
    duree_minutes INT DEFAULT 30,
    motif VARCHAR(255),
    statut ENUM('confirme', 'en_attente', 'annule', 'termine') DEFAULT 'en_attente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_patient) REFERENCES patients(id_patient) ON DELETE CASCADE,
    FOREIGN KEY (id_medecin) REFERENCES medecins(id_medecin) ON DELETE CASCADE,
    INDEX idx_date_heure (date_heure)
);

CREATE TABLE consultations (
    id_consultation INT AUTO_INCREMENT PRIMARY KEY,
    id_patient INT NOT NULL,
    id_medecin INT NOT NULL,
    id_rdv INT NULL,
    date_consultation DATETIME NOT NULL,
    motif VARCHAR(255),
    examen_clinique TEXT,
    diagnostic VARCHAR(255),
    observations TEXT,
    poids DECIMAL(5,2),
    tension VARCHAR(20),
    temperature DECIMAL(4,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_patient) REFERENCES patients(id_patient) ON DELETE CASCADE,
    FOREIGN KEY (id_medecin) REFERENCES medecins(id_medecin) ON DELETE CASCADE,
    FOREIGN KEY (id_rdv) REFERENCES rendez_vous(id_rdv) ON DELETE SET NULL,
    INDEX idx_date_consultation (date_consultation)
);

CREATE TABLE actes_medicaux (
    id_acte INT AUTO_INCREMENT PRIMARY KEY,
    id_consultation INT NOT NULL,
    code_acte VARCHAR(20),
    libelle VARCHAR(255) NOT NULL,
    tarif DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_consultation) REFERENCES consultations(id_consultation) ON DELETE CASCADE
);

CREATE TABLE ordonnances (
    id_ordonnance INT AUTO_INCREMENT PRIMARY KEY,
    id_consultation INT NOT NULL,
    date_ordonnance DATETIME NOT NULL,
    recommandations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_consultation) REFERENCES consultations(id_consultation) ON DELETE CASCADE
);

CREATE TABLE medicaments (
    id_medicament INT AUTO_INCREMENT PRIMARY KEY,
    nom_commercial VARCHAR(255) NOT NULL,
    dci VARCHAR(255),
    forme VARCHAR(100),
    dosage VARCHAR(100)
);

CREATE TABLE lignes_ordonnances (
    id_ligne INT AUTO_INCREMENT PRIMARY KEY,
    id_ordonnance INT NOT NULL,
    id_medicament INT NOT NULL,
    posologie VARCHAR(255) NOT NULL,
    duree_jours INT,
    FOREIGN KEY (id_ordonnance) REFERENCES ordonnances(id_ordonnance) ON DELETE CASCADE,
    FOREIGN KEY (id_medicament) REFERENCES medicaments(id_medicament)
);

CREATE TABLE assurances (
    id_assurance INT AUTO_INCREMENT PRIMARY KEY,
    nom_assurance VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    email VARCHAR(100),
    taux_couverture DECIMAL(5,2)
);

CREATE TABLE factures (
    id_facture INT AUTO_INCREMENT PRIMARY KEY,
    id_consultation INT NOT NULL,
    id_patient INT NOT NULL,
    id_assurance INT NULL,
    numero_facture VARCHAR(50) UNIQUE NOT NULL,
    montant_total DECIMAL(10,2) NOT NULL,
    part_assurance DECIMAL(10,2) DEFAULT 0,
    part_patient DECIMAL(10,2) NOT NULL,
    montant_paye DECIMAL(10,2) DEFAULT 0,
    statut ENUM('en_attente', 'partiel', 'paye') DEFAULT 'en_attente',
    date_emission DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_consultation) REFERENCES consultations(id_consultation) ON DELETE CASCADE,
    FOREIGN KEY (id_patient) REFERENCES patients(id_patient) ON DELETE CASCADE,
    FOREIGN KEY (id_assurance) REFERENCES assurances(id_assurance) ON DELETE SET NULL
);

CREATE TABLE paiements (
    id_paiement INT AUTO_INCREMENT PRIMARY KEY,
    id_facture INT NOT NULL,
    montant DECIMAL(10,2) NOT NULL,
    mode_paiement ENUM('especes', 'carte', 'cheque', 'virement') NOT NULL,
    date_paiement DATETIME NOT NULL,
    reference VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_facture) REFERENCES factures(id_facture) ON DELETE CASCADE
);

CREATE TABLE stock (
    id_stock INT AUTO_INCREMENT PRIMARY KEY,
    id_medicament INT NOT NULL,
    quantite INT NOT NULL,
    prix_unitaire DECIMAL(10,2),
    date_expiration DATE,
    seuil_alerte INT DEFAULT 10,
    derniere_maj TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_medicament) REFERENCES medicaments(id_medicament) ON DELETE CASCADE
);

CREATE TABLE personal_access_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    abilities TEXT,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    INDEX idx_tokenable (tokenable_type, tokenable_id)
);

CREATE TABLE migrations (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    migration VARCHAR(255) NOT NULL,
    batch INT NOT NULL
);

ALTER TABLE users 
ADD CONSTRAINT fk_user_medecin FOREIGN KEY (id_medecin) REFERENCES medecins(id_medecin) ON DELETE SET NULL,
ADD CONSTRAINT fk_user_patient FOREIGN KEY (id_patient) REFERENCES patients(id_patient) ON DELETE SET NULL;