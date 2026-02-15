import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  UsersIcon, 
  CalendarIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Patients', path: '/patients', icon: UsersIcon },
    { name: 'Rendez-vous', path: '/rendez-vous', icon: CalendarIcon },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-lg sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              <div className="bg-white p-2 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Clinique Médicale</h1>
                <p className="text-xs text-blue-100">Gestion intelligente</p>
              </div>
            </motion.div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <motion.button
                key={item.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(item.path)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-white/20 transition"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </motion.button>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-white">{user?.email}</p>
              <p className="text-xs text-blue-100 capitalize">{user?.role}</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-white transition"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Déconnexion</span>
            </motion.button>

            {/* Mobile menu button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden text-white"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pb-4 space-y-2"
          >
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setShowMobileMenu(false);
                }}
                className="flex items-center space-x-2 w-full px-4 py-2 rounded-lg text-white hover:bg-white/20"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;