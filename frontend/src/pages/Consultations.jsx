import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import { useToast } from '../context/ToastContext';
import { consultationService } from '../services/consultationService';
import { MESSAGES } from '../constants';
import {
  DocumentTextIcon,
  UserIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  XMarkIcon,
  CalendarIcon,
  LightBulbIcon,
  CheckBadgeIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const Consultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('Tous');
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();
  
  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    date: '',
    diagnosis: '',
    notes: '',
    priority: 'Normale'
  });

  const loadConsultations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await consultationService.getAll();
      console.log('Consultation Response:', response);
      // API returns array directly
      const data = Array.isArray(response.data) ? response.data : [];
      console.log('Consultation Data:', data);
      setConsultations(data);
    } catch (err) {
      console.error('Erreur lors du chargement des consultations:', err);
      error(MESSAGES.LOAD_ERROR);
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  }, [error]);

  // Fetch consultations on component mount
  useEffect(() => {
    loadConsultations();
  }, [loadConsultations]);

  const filteredConsultations = consultations.filter(cons =>
    (priorityFilter === 'Tous' || cons.priority === priorityFilter) &&
    (cons.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cons.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cons.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cons.date.includes(searchTerm))
  ).sort((a, b) => {
    // Sort by priority (Urgente > Importante > Normale)
    const priorityOrder = { 'Urgente': 0, 'Importante': 1, 'Normale': 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    // Then sort by date descending (newest first)
    return new Date(b.date) - new Date(a.date);
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgente':
        return { bg: 'bg-red-100', text: 'text-red-700', icon: LightBulbIcon };
      case 'Importante':
        return { bg: 'bg-orange-100', text: 'text-orange-700', icon: CheckBadgeIcon };
      case 'Normale':
        return { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckBadgeIcon };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: CheckBadgeIcon };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (selectedConsultation) {
        await consultationService.update(selectedConsultation.id, formData);
        success(MESSAGES.UPDATED);
      } else {
        await consultationService.create(formData);
        success(MESSAGES.CREATED);
      }
      setShowModal(false);
      resetForm();
      loadConsultations();
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement:', err);
      error(MESSAGES.UPDATE_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (consultation) => {
    setSelectedConsultation(consultation);
    setFormData({
      patient: consultation.patient,
      doctor: consultation.doctor,
      date: consultation.date,
      diagnosis: consultation.diagnosis,
      notes: consultation.notes,
      priority: consultation.priority
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(MESSAGES.CONFIRM_DELETE)) {
      try {
        setLoading(true);
        await consultationService.delete(id);
        success(MESSAGES.DELETED);
        loadConsultations();
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        error(MESSAGES.DELETE_ERROR);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      patient: '',
      doctor: '',
      date: '',
      diagnosis: '',
      notes: '',
      priority: 'Normale'
    });
    setSelectedConsultation(null);
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const isRecent = (date) => {
    const consultationDate = new Date(date);
    const today = new Date();
    const daysDiff = Math.floor((today - consultationDate) / (1000 * 60 * 60 * 24));
    return daysDiff <= 3;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 dark:text-white">
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Consultations</h1>
              <p className="text-gray-600">Historique et suivi des consultations</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 shadow-lg flex items-center space-x-2 font-medium"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Nouvelle Consultation</span>
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
              placeholder="Rechercher par patient, médecin, diagnostic ou date..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
            />
          </div>
        </motion.div>

        {/* Statistics & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Tous', count: consultations.length, color: 'bg-gradient-to-br from-slate-500 to-slate-600' },
            { label: 'Urgente', count: consultations.filter(c => c.priority === 'Urgente').length, color: 'bg-gradient-to-br from-red-500 to-red-600' },
            { label: 'Importante', count: consultations.filter(c => c.priority === 'Importante').length, color: 'bg-gradient-to-br from-orange-500 to-orange-600' },
            { label: 'Normale', count: consultations.filter(c => c.priority === 'Normale').length, color: 'bg-gradient-to-br from-blue-500 to-blue-600' }
          ].map((stat) => (
            <motion.button
              key={stat.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPriorityFilter(stat.label)}
              className={`p-4 rounded-xl text-white font-semibold transition-all ${stat.color} ${
                priorityFilter === stat.label 
                  ? 'ring-2 ring-offset-2 ring-purple-400 shadow-lg' 
                  : 'shadow-md hover:shadow-lg'
              }`}
            >
              <div className="text-2xl font-bold">{stat.count}</div>
              <div className="text-sm opacity-90">{stat.label}</div>
            </motion.button>
          ))}
        </motion.div>

        {/* Consultations Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredConsultations.map((consultation, index) => {
              const priorityColor = getPriorityColor(consultation.priority);
              const PriorityIcon = priorityColor.icon;
              const recent = isRecent(consultation.date);
              const isUrgent = consultation.priority === 'Urgente';
              return (
                <motion.div
                  key={consultation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all border-2 ${
                    isUrgent ? 'border-red-400' : recent ? 'border-purple-300' : 'border-gray-100'
                  }`}
                >
                  {/* Header */}
                  <div className={`bg-gradient-to-r from-purple-500 to-pink-600 p-6 ${isUrgent && 'relative overflow-hidden'}`}>
                    {isUrgent && (
                      <div className="absolute inset-0 opacity-20 animate-pulse bg-red-500"></div>
                    )}
                    <div className="flex items-start justify-between mb-3 relative z-10">
                      <div className="flex items-center space-x-3">
                        <div className="bg-white/20 backdrop-blur-lg p-3 rounded-xl">
                          <DocumentTextIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-purple-100 text-sm">Consultation</p>
                          <p className="text-white font-bold text-lg">{formatDate(consultation.date)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 relative z-10 flex-wrap">
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className={`flex items-center space-x-2 px-3 py-1 rounded-full ${priorityColor.bg}`}
                      >
                        <PriorityIcon className={`w-4 h-4 ${priorityColor.text}`} />
                        <span className={`text-xs font-semibold ${priorityColor.text}`}>
                          {consultation.priority}
                        </span>
                      </motion.div>
                      {recent && (
                        <span className="text-xs font-bold bg-white text-purple-600 px-2 py-1 rounded-full">
                          Récente
                        </span>
                      )}
                      {isUrgent && (
                        <span className="text-xs font-bold bg-red-600 text-white px-2 py-1 rounded-full animate-pulse">
                          ⚡ URGENT
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-gray-600">
                        <UserIcon className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="text-xs text-gray-500">Patient</p>
                          <p className="font-semibold text-gray-900">{consultation.patient}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-600">
                        <UserIcon className="w-5 h-5 text-pink-500" />
                        <div>
                          <p className="text-xs text-gray-500">Médecin</p>
                          <p className="font-semibold text-gray-900">{consultation.doctor}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-600">
                        <SparklesIcon className="w-5 h-5 text-indigo-500" />
                        <div>
                          <p className="text-xs text-gray-500">Diagnostic</p>
                          <p className="font-semibold text-gray-900">{consultation.diagnosis}</p>
                        </div>
                      </div>
                    </div>

                    {consultation.notes && (
                      <div className="pt-4 border-t border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Notes médicales</p>
                        <p className="text-sm text-gray-700 line-clamp-3">{consultation.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="px-6 pb-6 flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(consultation)}
                      className="flex-1 bg-purple-50 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-100 transition flex items-center justify-center space-x-2 font-medium"
                    >
                      <PencilIcon className="w-4 h-4" />
                      <span>Modifier</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(consultation.id)}
                      className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition flex items-center justify-center space-x-2 font-medium"
                    >
                      <TrashIcon className="w-4 h-4" />
                      <span>Supprimer</span>
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredConsultations.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <DocumentTextIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucune consultation trouvée</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Aucun résultat pour votre recherche' 
                : priorityFilter !== 'Tous'
                ? `Aucune consultation ${priorityFilter.toLowerCase()}`
                : 'Commencez par enregistrer votre première consultation'}
            </p>
            {!searchTerm && priorityFilter === 'Tous' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl shadow-lg inline-flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Ajouter une consultation</span>
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
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 sticky top-0">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-white">
                    {selectedConsultation ? 'Modifier la consultation' : 'Nouvelle consultation'}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient *</label>
                    <input
                      type="text"
                      value={formData.patient}
                      onChange={(e) => setFormData({...formData, patient: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                      placeholder="Nom du patient"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Médecin *</label>
                    <input
                      type="text"
                      value={formData.doctor}
                      onChange={(e) => setFormData({...formData, doctor: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                      placeholder="Nom du médecin"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date de consultation *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priorité *</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="Normale">Normale</option>
                      <option value="Importante">Importante</option>
                      <option value="Urgente">Urgente</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Diagnostic *</label>
                  <input
                    type="text"
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                    placeholder="Diagnostic ou type de consultation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes médicales</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows="4"
                    placeholder="Observations, recommandations, prescriptions..."
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
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 shadow-lg font-medium"
                  >
                    {selectedConsultation ? 'Mettre à jour' : 'Enregistrer'}
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

export default Consultations;