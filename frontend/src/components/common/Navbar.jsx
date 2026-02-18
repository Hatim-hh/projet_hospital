import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  HomeIcon, 
  UsersIcon, 
  CalendarIcon,
  DocumentTextIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  CogIcon,
  UserCircleIcon,
  ChevronDownIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { settings, updateSetting, t } = useSettings();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const menuItems = [
    { name: t('dashboard'), path: '/dashboard', icon: HomeIcon },
    { name: t('patients'), path: '/patients', icon: UsersIcon },
    { name: t('rendezvous'), path: '/rendez-vous', icon: CalendarIcon },
    { name: t('consultations'), path: '/consultations', icon: DocumentTextIcon },
  ];

  const userMenuItems = [
    { name: t('myProfile'), path: '/profile', icon: UserCircleIcon },
    { name: t('settings'), path: '/settings', icon: CogIcon },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const toggleDarkMode = () => {
    updateSetting('darkMode', !settings.darkMode);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 dark:from-blue-900 dark:via-blue-950 dark:to-indigo-950 shadow-xl dark:shadow-2xl sticky top-0 z-50 border-b border-blue-500/20 dark:border-blue-800/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section - Enhanced Visibility */}
          <div className="flex items-center flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate('/dashboard')}
            >
              <div className="bg-white dark:bg-blue-100 p-2 rounded-xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 w-10 h-10 flex items-center justify-center">
                <img src="/medical-logo.svg" alt="Clinic Logo" className="w-8 h-8" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-black text-white drop-shadow-lg group-hover:drop-shadow-xl transition">
                  Clinique Médicale
                </h1>
                <p className="text-xs text-blue-100 font-semibold">Gestion Complète</p>
              </div>
            </motion.div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => (
              <motion.button
                key={item.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(item.path)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:bg-white/20 dark:hover:bg-blue-800/50 transition-all duration-200 font-medium text-sm group"
              >
                <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="hidden xl:inline">{item.name}</span>
              </motion.button>
            ))}
          </div>

          {/* Right Side - User Menu & Theme Toggle */}
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Theme Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 dark:bg-blue-800/30 dark:hover:bg-blue-800/50 text-white transition-all duration-200"
              title="Toggle dark mode"
            >
              {settings.darkMode ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </motion.button>

            {/* User Info - Desktop Only */}
            <div className="hidden md:flex items-center gap-3 border-r border-white/20 pr-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-300 to-indigo-400 dark:from-blue-500 dark:to-indigo-600 flex items-center justify-center ring-2 ring-white/30">
                  <span className="text-sm font-bold text-white">
                    {user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-white truncate max-w-xs">{user?.email || 'User'}</p>
                  <p className="text-xs text-blue-100 capitalize font-medium">{user?.role === 'admin' ? 'Administrateur' : user?.role === 'doctor' ? 'Médecin' : 'Patient'}</p>
                </div>
              </div>
            </div>
            
            {/* User Dropdown */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 bg-white/20 dark:bg-blue-800/30 hover:bg-white/30 dark:hover:bg-blue-800/50 px-3 py-2 rounded-lg text-white transition-all duration-200 ring-1 ring-white/10"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-300 to-indigo-400 dark:from-blue-500 dark:to-indigo-600 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
              </motion.button>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-2xl z-10 border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  {/* Header with User Info */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center ring-2 ring-white/50">
                        <span className="text-lg font-bold text-white">
                          {user?.email?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white truncate">{user?.email || 'User'}</p>
                        <p className="text-xs text-blue-100 capitalize font-medium">
                          {user?.role === 'admin' ? '👑 Administrateur' : user?.role === 'doctor' ? '👨‍⚕️ Médecin' : '👤 Patient'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-gray-200 dark:border-gray-700"></div>

                  {userMenuItems.map((item, idx) => (
                    <motion.button
                      key={item.path}
                      whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                      onClick={() => {
                        navigate(item.path);
                        setShowUserDropdown(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-150 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                    >
                      <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium text-sm">{item.name}</span>
                    </motion.button>
                  ))}
                  <motion.button
                    whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                    onClick={() => {
                      handleLogout();
                      setShowUserDropdown(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150 font-medium"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span className="text-sm">{t('logout')}</span>
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden text-white p-2 hover:bg-white/20 dark:hover:bg-blue-800/30 rounded-lg transition"
            >
              <Bars3Icon className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden pb-4 space-y-2 bg-blue-500/10 dark:bg-blue-900/20 rounded-b-xl p-4 border-t border-blue-400/20"
          >
            {menuItems.map((item) => (
              <motion.button
                key={item.path}
                whileHover={{ x: 5 }}
                onClick={() => {
                  navigate(item.path);
                  setShowMobileMenu(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-white hover:bg-white/20 dark:hover:bg-blue-800/50 transition-all font-medium"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </motion.button>
            ))}
            <div className="border-t border-white/20 my-2"></div>
            {userMenuItems.map((item) => (
              <motion.button
                key={item.path}
                whileHover={{ x: 5 }}
                onClick={() => {
                  navigate(item.path);
                  setShowMobileMenu(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-white hover:bg-white/20 dark:hover:bg-blue-800/50 transition-all font-medium"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </motion.button>
            ))}
            <motion.button
              whileHover={{ x: 5 }}
              onClick={() => {
                handleLogout();
                setShowMobileMenu(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-red-200 hover:bg-red-500/20 transition-all font-medium"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span>{t('logout')}</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;