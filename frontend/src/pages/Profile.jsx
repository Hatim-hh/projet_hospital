import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { staggerContainer, staggerItem } from '../utils/animations';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { user } = useAuth();
  const { success } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    nom: user?.nom || 'Dr. Jean Dupont',
    email: user?.email || 'jean.dupont@clinic.fr',
    telephone: '+33 6 12 34 56 78',
    specialite: 'Médecin généraliste',
    adresse: '123 rue de l\'Hôpital, Paris',
    ville: 'Paris',
    codePostal: '75001',
    dateInsription: '2023-01-15'
  });

  const [formData, setFormData] = useState(profile);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
    success('Profil mis à jour avec succès');
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const profileFields = [
    { label: 'Nom', key: 'nom', icon: UserCircleIcon },
    { label: 'Email', key: 'email', icon: EnvelopeIcon },
    { label: 'Téléphone', key: 'telephone', icon: PhoneIcon },
    { label: 'Spécialité', key: 'specialite', icon: UserCircleIcon },
    { label: 'Adresse', key: 'adresse', icon: MapPinIcon },
    { label: 'Ville', key: 'ville', icon: MapPinIcon },
    { label: 'Code Postal', key: 'codePostal', icon: MapPinIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 dark:text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mon Profil</h1>
          <p className="text-gray-600">Gérez vos informations personnelles</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Profile Header */}
          <motion.div variants={staggerItem}>
            <Card>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <UserCircleIcon className="w-20 h-20 text-white" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-3xl font-bold text-gray-900">{profile.nom}</h2>
                  <p className="text-lg text-blue-600 font-medium mt-1">{profile.specialite}</p>
                  <p className="text-gray-600 mt-2">
                    Membre depuis {new Date(profile.dateInsription).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </p>
                </div>
                {!isEditing && (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Modifier
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Profile Information */}
          <motion.div variants={staggerItem} className="mt-6">
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Informations Personnelles</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profileFields.map((field, idx) => {
                  const Icon = field.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <Icon className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 font-medium">{field.label}</p>
                        {isEditing ? (
                          <input
                            type="text"
                            name={field.key}
                            value={formData[field.key]}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium mt-1">{profile[field.key]}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {isEditing && (
                <div className="mt-8 pt-6 border-t border-gray-200 flex gap-3 justify-end">
                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                    className="flex items-center gap-2"
                  >
                    <XMarkIcon className="w-4 h-4" />
                    Annuler
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    className="flex items-center gap-2"
                  >
                    <CheckIcon className="w-4 h-4" />
                    Enregistrer
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Statistics */}
          <motion.div variants={staggerItem} className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Patients', value: '145', color: 'blue' },
              { label: 'Consultations', value: '2,340', color: 'green' },
              { label: 'Taux de satisfaction', value: '98%', color: 'purple' }
            ].map((stat, idx) => (
              <Card key={idx} className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 border-${stat.color}-200`}>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                <p className={`text-3xl font-bold mt-2 text-${stat.color}-600`}>{stat.value}</p>
              </Card>
            ))}
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={staggerItem} className="mt-6">
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Activité Récente</h3>
              <div className="space-y-3">
                {[
                  { action: 'Consultation avec M. Dupré', date: 'Aujourd\'hui à 14:30' },
                  { action: 'Mise à jour du profil', date: 'Hier à 09:15' },
                  { action: 'Nouveau patient enregistré', date: 'Il y a 2 jours' }
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <p className="text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.date}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
