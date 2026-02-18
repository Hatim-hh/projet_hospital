// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  
  // Patients
  PATIENTS: '/patients',
  PATIENT_BY_ID: (id) => `/patients/${id}`,
  
  // Consultations
  CONSULTATIONS: '/consultations',
  CONSULTATION_BY_ID: (id) => `/consultations/${id}`,
  
  // Rendez-vous
  RENDEZ_VOUS: '/rendez-vous',
  RENDEZ_VOUS_BY_ID: (id) => `/rendez-vous/${id}`,
  
  // Statistics
  STATS_DASHBOARD: '/statistiques/dashboard',
};

// Messages
export const MESSAGES = {
  // Success
  SUCCESS: 'Opération réussie',
  CREATED: 'Créé avec succès',
  UPDATED: 'Mise à jour réussie',
  DELETED: 'Supprimé avec succès',
  SAVED: 'Enregistré avec succès',
  
  // Error
  ERROR: 'Une erreur est survenue',
  LOAD_ERROR: 'Erreur lors du chargement des données',
  CREATE_ERROR: 'Erreur lors de la création',
  UPDATE_ERROR: 'Erreur lors de la mise à jour',
  DELETE_ERROR: 'Erreur lors de la suppression',
  NETWORK_ERROR: 'Erreur de connexion',
  
  // Validation
  REQUIRED_FIELD: 'Ce champ est requis',
  INVALID_EMAIL: 'Email invalide',
  INVALID_PHONE: 'Numéro de téléphone invalide',
  
  // Confirmation
  CONFIRM_DELETE: 'Êtes-vous sûr de vouloir supprimer ?',
  CONFIRM_LOGOUT: 'Êtes-vous sûr de vouloir vous déconnecter ?',
};

// Priority levels
export const PRIORITY_LEVELS = {
  BASSE: 'Basse',
  NORMALE: 'Normale',
  HAUTE: 'Haute',
  URGENTE: 'Urgente',
};

// Consultation status
export const CONSULTATION_STATUS = {
  EN_COURS: 'En cours',
  COMPLETE: 'Complétée',
  ANNULEE: 'Annulée',
  EN_ATTENTE: 'En attente',
};

// Gender options
export const GENDER_OPTIONS = [
  { value: 'M', label: 'Homme' },
  { value: 'F', label: 'Femme' },
];

// Blood types
export const BLOOD_TYPES = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

// Marital status
export const MARITAL_STATUS = [
  { value: 'Célibataire', label: 'Célibataire' },
  { value: 'Marié(e)', label: 'Marié(e)' },
  { value: 'Divorcé(e)', label: 'Divorcé(e)' },
  { value: 'Veuf(ve)', label: 'Veuf(ve)' },
];

// Appointment types
export const APPOINTMENT_TYPES = {
  EN_PERSONNE: 'En personne',
  TELEPHONE: 'Téléphone',
  EN_LIGNE: 'En ligne',
};

// Notification settings
export const TOAST_DURATION = {
  SHORT: 2000,
  NORMAL: 3000,
  LONG: 5000,
  PERSISTENT: 0,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [5, 10, 25, 50],
};
