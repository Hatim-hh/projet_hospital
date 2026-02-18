import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import { useToast } from '../context/ToastContext';
import { rendezVousService } from '../services/rendezVousService';
import { MESSAGES } from '../constants';
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  NoSymbolIcon
} from '@heroicons/react/24/outline';

const RendezVous = () => {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();
  
  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    date: '',
    time: '',
    status: 'En attente',
    notes: ''
  });

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await rendezVousService.getAll();
      console.log('RDV Response:', response);
      // API returns array directly
      const data = Array.isArray(response.data) ? response.data : [];
      console.log('RDV Data:', data);
      setAppointments(data);
    } catch (err) {
      console.error('Erreur lors du chargement des rendez-vous:', err);
      error(MESSAGES.LOAD_ERROR);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [error]);

  // Fetch appointments on component mount
  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const filteredAppointments = appointments.filter(apt =>
    (statusFilter === 'Tous' || apt.status === statusFilter) &&
    (apt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.date.includes(searchTerm))
  ).sort((a, b) => {
    // Sort by date ascending (upcoming first)
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA - dateB;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmé':
        return { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircleIcon };
      case 'En attente':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: ExclamationCircleIcon };
      case 'Annulé':
        return { bg: 'bg-red-100', text: 'text-red-700', icon: NoSymbolIcon };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: CheckCircleIcon };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (selectedAppointment) {
        await rendezVousService.update(selectedAppointment.id, formData);
        success(MESSAGES.UPDATED);
      } else {
        await rendezVousService.create(formData);
        success(MESSAGES.CREATED);
      }
      setShowModal(false);
      resetForm();
      loadAppointments();
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement:', err);
      error(MESSAGES.UPDATE_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      patient: appointment.patient,
      doctor: appointment.doctor,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      notes: appointment.notes
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(MESSAGES.CONFIRM_DELETE)) {
      try {
        setLoading(true);
        await rendezVousService.delete(id);
        success(MESSAGES.DELETED);
        loadAppointments();
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
      time: '',
      status: 'En attente',
      notes: ''
    });
    setSelectedAppointment(null);
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const isUpcoming = (date) => {
    const appointmentDate = new Date(`${date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointmentDate >= today;
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Rendez-vous</h1>
              <p className="text-gray-600">Gérez les rendez-vous de vos patients</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-teal-700 shadow-lg flex items-center space-x-2 font-medium"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Nouveau RDV</span>
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
              placeholder="Rechercher par patient, médecin ou date..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
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
            { label: 'Tous', count: appointments.length, color: 'bg-gradient-to-br from-gray-500 to-gray-600' },
            { label: 'Confirmé', count: appointments.filter(a => a.status === 'Confirmé').length, color: 'bg-gradient-to-br from-green-500 to-emerald-600' },
            { label: 'En attente', count: appointments.filter(a => a.status === 'En attente').length, color: 'bg-gradient-to-br from-yellow-500 to-amber-600' },
            { label: 'Annulé', count: appointments.filter(a => a.status === 'Annulé').length, color: 'bg-gradient-to-br from-red-500 to-red-600' }
          ].map((stat) => (
            <motion.button
              key={stat.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStatusFilter(stat.label)}
              className={`p-4 rounded-xl text-white font-semibold transition-all ${stat.color} ${
                statusFilter === stat.label 
                  ? 'ring-2 ring-offset-2 ring-emerald-400 shadow-lg' 
                  : 'shadow-md hover:shadow-lg'
              }`}
            >
              <div className="text-2xl font-bold">{stat.count}</div>
              <div className="text-sm opacity-90">{stat.label}</div>
            </motion.button>
          ))}
        </motion.div>

        {/* Appointments Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredAppointments.map((appointment, index) => {
              const statusColor = getStatusColor(appointment.status);
              const StatusIcon = statusColor.icon;
              const upcoming = isUpcoming(appointment.date);
              return (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all border-2 ${
                    upcoming ? 'border-emerald-300' : 'border-gray-100'
                  }`}
                >
                  {/* Header */}
                  <div className={`bg-gradient-to-r from-emerald-500 to-teal-600 p-6 ${!upcoming && 'opacity-75'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="bg-white/20 backdrop-blur-lg p-3 rounded-xl">
                          <CalendarIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-emerald-100 text-sm">Rendez-vous</p>
                          <p className="text-white font-bold">{formatDate(appointment.date)}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className={`flex items-center space-x-1 px-3 py-1 rounded-full ${statusColor.bg}`}
                        >
                          <StatusIcon className={`w-4 h-4 ${statusColor.text}`} />
                          <span className={`text-xs font-semibold ${statusColor.text}`}>
                            {appointment.status}
                          </span>
                        </motion.div>
                        {upcoming && (
                          <span className="text-xs font-bold bg-white text-emerald-600 px-2 py-1 rounded-full">
                            À venir
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-gray-600">
                        <UserIcon className="w-5 h-5 text-emerald-500" />
                        <div>
                          <p className="text-xs text-gray-500">Patient</p>
                          <p className="font-semibold text-gray-900">{appointment.patient}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-600">
                        <UserIcon className="w-5 h-5 text-teal-500" />
                        <div>
                          <p className="text-xs text-gray-500">Médecin</p>
                          <p className="font-semibold text-gray-900">{appointment.doctor}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-600">
                        <ClockIcon className="w-5 h-5 text-amber-500" />
                        <div>
                          <p className="text-xs text-gray-500">Heure</p>
                          <p className="font-semibold text-gray-900">{appointment.time}</p>
                        </div>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Notes</p>
                        <p className="text-sm text-gray-700 line-clamp-2">{appointment.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="px-6 pb-6 flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(appointment)}
                      className="flex-1 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-100 transition flex items-center justify-center space-x-2"
                    >
                      <PencilIcon className="w-4 h-4" />
                      <span>Modifier</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(appointment.id)}
                      className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition flex items-center justify-center space-x-2"
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
        {!loading && filteredAppointments.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <CalendarIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun rendez-vous trouvé</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Aucun résultat pour votre recherche' 
                : statusFilter !== 'Tous'
                ? `Aucun rendez-vous ${statusFilter.toLowerCase()}`
                : 'Commencez par ajouter votre premier rendez-vous'}
            </p>
            {!searchTerm && statusFilter === 'Tous' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl shadow-lg inline-flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Ajouter un rendez-vous</span>
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
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-white">
                    {selectedAppointment ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                      placeholder="Nom du médecin"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Heure *</label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Statut *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    >
                      <option value="Confirmé">Confirmé</option>
                      <option value="En attente">En attente</option>
                      <option value="Annulé">Annulé</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    rows="3"
                    placeholder="Remarques supplémentaires..."
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
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 shadow-lg font-medium"
                  >
                    {selectedAppointment ? 'Mettre à jour' : 'Enregistrer'}
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

export default RendezVous;