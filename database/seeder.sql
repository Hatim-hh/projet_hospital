-- Données de test
USE clinique_medicale;

INSERT INTO specialites (nom_specialite, description) VALUES
('Médecine Générale', 'Consultation générale et suivi médical'),
('Cardiologie', 'Spécialiste du cœur et du système cardiovasculaire'),
('Dermatologie', 'Spécialiste de la peau'),
('Pédiatrie', 'Médecine des enfants'),
('Gynécologie', 'Santé de la femme');

INSERT INTO medecins (numero_ordre, nom, prenom, id_specialite, telephone, email, tarif_consultation) VALUES
('MED001', 'Bennani', 'Ahmed', 1, '0612345678', 'ahmed.bennani@clinique.ma', 300.00),
('MED002', 'Alami', 'Fatima', 2, '0612345679', 'fatima.alami@clinique.ma', 500.00),
('MED003', 'Tazi', 'Karim', 3, '0612345680', 'karim.tazi@clinique.ma', 400.00);

INSERT INTO users (email, password, role, id_medecin, id_patient) VALUES
('admin@clinique.ma', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', NULL, NULL),
('accueil@clinique.ma', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'accueil', NULL, NULL),
('ahmed.bennani@clinique.ma', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'medecin', 1, NULL);

INSERT INTO patients (numero_dossier, nom, prenom, date_naissance, sexe, telephone, adresse, email, groupe_sanguin, situation_familiale) VALUES
('P000001', 'Amrani', 'Mohammed', '1985-05-15', 'M', '0623456789', '45 Rue Mohammed V, Casablanca', 'mohammed.amrani@email.com', 'O+', 'Marié'),
('P000002', 'Berrada', 'Amal', '1990-08-22', 'F', '0634567890', '12 Avenue Hassan II, Rabat', 'amal.berrada@email.com', 'A+', 'Célibataire'),
('P000003', 'Chahid', 'Youssef', '1978-03-10', 'M', '0645678901', '78 Boulevard Zerktouni, Casablanca', 'youssef.chahid@email.com', 'B+', 'Marié');

INSERT INTO dossiers_medicaux (id_patient, antecedents_medicaux, allergies, maladies_chroniques) VALUES
(1, 'Diabète type 2', 'Pénicilline', 'Diabète, Hypertension'),
(2, 'Aucun', 'Aucune', 'Aucune'),
(3, 'Asthme', 'Pollen', 'Asthme');

INSERT INTO medicaments (nom_commercial, dci, forme, dosage) VALUES
('Paracétamol', 'Paracétamol', 'Comprimé', '500mg'),
('Amoxicilline', 'Amoxicilline', 'Gélule', '1g'),
('Metformine', 'Metformine', 'Comprimé', '500mg');

INSERT INTO assurances (nom_assurance, telephone, taux_couverture) VALUES
('CNSS', '0522123456', 70.00),
('Wafa Assurance', '0522234567', 80.00);

INSERT INTO migrations (migration, batch) VALUES
('2019_12_14_000001_create_personal_access_tokens_table', 1);

SELECT 'Données insérées avec succès!' AS Message;