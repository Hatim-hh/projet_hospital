import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import axios from 'axios';
import { 
  UsersIcon, 
  CalendarIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/statistiques/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Erreur stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Total Patients',
      value: stats?.total_patients || 0,
      icon: UsersIcon,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      change: '+12%',
      changePositive: true
    },
    {
      title: 'RDV Aujourd\'hui',
      value: stats?.rdv_aujourdhui || 0,
      icon: CalendarIcon,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      change: '+5%',
      changePositive: true
    },
    {
      title: 'Consultations',
      value: stats?.consultations_mois || 0,
      icon: DocumentTextIcon,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      change: '+8%',
      changePositive: true
    },
    {
      title: 'Revenu Mensuel',
      value: `${stats?.revenu_mois || 0} DH`,
      icon: CurrencyDollarIcon,
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-50',
      change: '+15%',
      changePositive: true
    }
  ];

  const quickActions = [
    { name: 'Nouveau Patient', path: '/patients', icon: UsersIcon, color: 'blue' },
    { name: 'Prendre RDV', path: '/rendez-vous', icon: CalendarIcon, color: 'green' },
    { name: 'Consultations', path: '/consultations', icon: DocumentTextIcon, color: 'purple' },
  ];

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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Tableau de bord
          </h1>
          <p className="text-gray-600">Vue d'ensemble de votre clinique</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`bg-gradient-to-br ${card.bgGradient} rounded-2xl shadow-lg overflow-hidden border border-white/50`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`bg-gradient-to-br ${card.gradient} p-3 rounded-xl shadow-lg`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                    className={`flex items-center space-x-1 text-sm font-medium ${
                      card.changePositive ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    <ArrowTrendingUpIcon className="w-4 h-4" />
                    <span>{card.change}</span>
                  </motion.div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(action.path)}
                className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-${action.color}-200`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`bg-${action.color}-100 p-3 rounded-lg`}>
                    <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{action.name}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity & Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Welcome Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-8 text-white"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold mb-2">Bienvenue ! 👋</h3>
                <p className="text-blue-100">
                  Système de gestion moderne pour votre clinique médicale
                </p>
              </div>
              <CheckCircleIcon className="w-12 h-12 text-white/30" />
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center space-x-3 text-blue-100">
                <ClockIcon className="w-5 h-5" />
                <span>Dernière connexion : Aujourd'hui</span>
              </div>
              <div className="flex items-center space-x-3 text-blue-100">
                <CheckCircleIcon className="w-5 h-5" />
                <span>Système à jour</span>
              </div>
            </div>
          </motion.div>

          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Activité récente</h3>
            <div className="space-y-4">
              {[
                { type: 'patient', text: 'Nouveau patient enregistré', time: 'Il y a 2h', color: 'blue' },
                { type: 'rdv', text: 'Rendez-vous confirmé', time: 'Il y a 3h', color: 'green' },
                { type: 'consultation', text: 'Consultation terminée', time: 'Il y a 5h', color: 'purple' },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className={`w-2 h-2 rounded-full bg-${activity.color}-500`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;