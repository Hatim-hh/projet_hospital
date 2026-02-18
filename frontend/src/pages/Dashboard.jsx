import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
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
  const { t } = useSettings();
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
      title: t('totalPatients'),
      value: stats?.total_patients || 0,
      icon: UsersIcon,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 dark:from-blue-900/30 to-cyan-50 dark:to-cyan-900/30',
      change: '+12%',
      changePositive: true
    },
    {
      title: t('appointmentsToday'),
      value: stats?.rdv_aujourdhui || 0,
      icon: CalendarIcon,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 dark:from-green-900/30 to-emerald-50 dark:to-emerald-900/30',
      change: '+5%',
      changePositive: true
    },
    {
      title: t('consultations'),
      value: stats?.consultations_mois || 0,
      icon: DocumentTextIcon,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 dark:from-purple-900/30 to-pink-50 dark:to-pink-900/30',
      change: '+8%',
      changePositive: true
    },
    {
      title: t('monthlyRevenue'),
      value: `${stats?.revenu_mois || 0} DH`,
      icon: CurrencyDollarIcon,
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-50 dark:from-yellow-900/30 to-orange-50 dark:to-orange-900/30',
      change: '+15%',
      changePositive: true
    }
  ];

  const quickActions = [
    { name: t('patients'), path: '/patients', icon: UsersIcon, color: 'blue' },
    { name: t('rendezvous'), path: '/rendez-vous', icon: CalendarIcon, color: 'green' },
    { name: t('consultations'), path: '/consultations', icon: DocumentTextIcon, color: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
            {t('dashboard')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">{t('overview')}</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className={`bg-gradient-to-br ${card.bgGradient} rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden border border-white/50 dark:border-gray-700/50 transition-all duration-300`}
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
                    className={`flex items-center space-x-1 text-sm font-semibold ${
                      card.changePositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    <ArrowTrendingUpIcon className="w-4 h-4" />
                    <span>{card.change}</span>
                  </motion.div>
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">{card.title}</h3>
                <p className="text-3xl font-black text-gray-900 dark:text-white">{card.value}</p>
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('quickActions')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(action.path)}
                className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl dark:shadow-gray-950 transition-all border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`bg-${action.color}-100 dark:bg-${action.color}-900/30 p-4 rounded-xl`}>
                    <action.icon className={`w-6 h-6 text-${action.color}-600 dark:text-${action.color}-400`} />
                  </div>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">{action.name}</span>
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
            className="bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 rounded-2xl shadow-xl p-8 text-white overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full transform translate-x-20 -translate-y-10"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full transform -translate-x-20 translate-y-10"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{t('welcome')} 👋</h3>
                  <p className="text-blue-100">
                    {t('overview')}
                  </p>
                </div>
                <CheckCircleIcon className="w-12 h-12 text-white/30" />
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center space-x-3 text-blue-100">
                  <ClockIcon className="w-5 h-5" />
                  <span>{t('lastLogin')}</span>
                </div>
                <div className="flex items-center space-x-3 text-blue-100">
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>{t('systemUp')}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-950 p-6 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('recentActivity')}</h3>
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
                  className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className={`w-3 h-3 rounded-full bg-${activity.color}-500`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{activity.text}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
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