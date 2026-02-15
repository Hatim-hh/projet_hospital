import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import { patientService } from '../services/patientService';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  XMarkIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({
    nom: '', prenom: '', date_naissance: '', sexe: 'M',
    telephone: '', email: '', adresse: '', groupe_sanguin: '', situation_familiale: ''
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const response = await patientService.getAll({ search: searchTerm });
      setPatients(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPatient) {
        await patientService.update(selectedPatient.id_patient, formData);
      } else {
        await patientService.create(formData);
      }
      setShowModal(false);
      resetForm();
      loadPatients();
    } catch (error) {
      alert('Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) {
      try {
        await patientService.delete(id);
        loadPatients();
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      nom: patient.nom,
      prenom: patient.prenom,
      date_naissance: patient.date_naissance,
      sexe: patient.sexe,
      telephone: patient.telephone || '',
      email: patient.email || '',
      adresse: patient.adresse || '',
      groupe_sanguin: patient.groupe_sanguin || '',
      situation_familiale: patient.situation_familiale || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      nom: '', prenom: '', date_naissance: '', sexe: 'M',
      telephone: '', email: '', adresse: '', groupe_sanguin: '', situation_familiale: ''
    });
    setSelectedPatient(null);
  };

  const filteredPatients = patients.filter(patient =>
    patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.numero_dossier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Patients</h1>
              <p className="text-gray-600">Gérez vos patients efficacement</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg flex items-center space-x-2 font-medium"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Nouveau Patient</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom, prénom ou numéro de dossier..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
        </motion.div>

        {/* Patients Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPatients.map((patient, index) => (
              <motion.div
                key={patient.id_patient}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 backdrop-blur-lg p-3 rounded-xl">
                      <UserIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {patient.nom} {patient.prenom}
                      </h3>
                      <p className="text-blue-100 text-sm">{patient.numero_dossier}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  {patient.telephone && (
                    <div className="flex items-center space-x-3 text-gray-600">
                      <PhoneIcon className="w-5 h-5 text-blue-500" />
                      <span>{patient.telephone}</span>
                    </div>
                  )}
                  {patient.email && (
                    <div className="flex items-center space-x-3 text-gray-600">
                      <EnvelopeIcon className="w-5 h-5 text-blue-500" />
                      <span className="truncate">{patient.email}</span>
                    </div>
                  )}
                  {patient.date_naissance && (
                    <div className="flex items-center space-x-3 text-gray-600">
                      <CalendarIcon className="w-5 h-5 text-blue-500" />
                      <span>{new Date(patient.date_naissance).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      patient.sexe === 'M' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-pink-100 text-pink-700'
                    }`}>
                      {patient.sexe === 'M' ? 'Masculin' : 'Féminin'}
                    </span>
                    {patient.groupe_sanguin && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        {patient.groupe_sanguin}
                      </span>
                    )}
                  </div>
                </div>

                <div className="px-6 pb-6 flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(patient)}
                    className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition flex items-center justify-center space-x-2"
                  >
                    <PencilIcon className="w-4 h-4" />
                    <span>Modifier</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(patient.id_patient)}
                    className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition flex items-center justify-center space-x-2"
                  >
                    <TrashIcon className="w-4 h-4" />
                    <span>Supprimer</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredPatients.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <UserIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun patient trouvé</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Essayez avec un autre terme de recherche' : 'Commencez par ajouter votre premier patient'}
            </p>
            {!searchTerm && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg inline-flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Ajouter un patient</span>
              </motion.button>
            )}
          </motion.div>
        )}
      </main>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-white">
                    {selectedPatient ? 'Modifier le patient' : 'Nouveau patient'}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-white hover:bg-white/20 p-2 rounded-lg transition"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                    <input
                      type="text"
                      value={formData.nom}
                      onChange={(e) => setFormData({...formData, nom: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                    <input
                      type="text"
                      value={formData.prenom}
                      onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance *</label>
                    <input
                      type="date"
                      value={formData.date_naissance}
                      onChange={(e) => setFormData({...formData, date_naissance: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sexe *</label>
                    <select
                      value={formData.sexe}
                      onChange={(e) => setFormData({...formData, sexe: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      value={formData.telephone}
                      onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Groupe sanguin</label>
                    <input
                      type="text"
                      value={formData.groupe_sanguin}
                      onChange={(e) => setFormData({...formData, groupe_sanguin: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: O+"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Situation familiale</label>
                    <input
                      type="text"
                      value={formData.situation_familiale}
                      onChange={(e) => setFormData({...formData, situation_familiale: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Marié(e)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                  <textarea
                    value={formData.adresse}
                    onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium"
                  >
                    Annuler
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg font-medium"
                  >
                    {selectedPatient ? 'Mettre à jour' : 'Enregistrer'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Patients;