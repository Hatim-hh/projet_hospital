import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { useSettings } from '../context/SettingsContext';
import { staggerContainer, staggerItem } from '../utils/animations';
import {
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  AdjustmentsHorizontalIcon,
  LanguageIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const { success } = useToast();
  const { settings, updateSetting, t } = useSettings();
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSettingChange = (key) => {
    const newValue = typeof localSettings[key] === 'boolean' ? !localSettings[key] : localSettings[key];
    setLocalSettings(prev => ({
      ...prev,
      [key]: newValue
    }));
    updateSetting(key, newValue);
  };

  const handleSaveSettings = () => {
    success(t('saveSettings'));
  };

  const settingSections = [
    {
      title: t('notifications'),
      icon: BellIcon,
      color: 'blue',
      settings: [
        {
          label: t('emailNotifications'),
          key: 'emailNotifications',
          description: t('receiveEmailAlerts')
        },
        {
          label: t('smsNotifications'),
          key: 'smsNotifications',
          description: t('receiveSmsAlerts')
        }
      ]
    },
    {
      title: t('appearance'),
      icon: AdjustmentsHorizontalIcon,
      color: 'purple',
      settings: [
        {
          label: t('darkMode'),
          key: 'darkMode',
          description: t('enableDarkTheme')
        }
      ]
    },
    {
      title: t('security'),
      icon: ShieldCheckIcon,
      color: 'green',
      settings: [
        {
          label: t('autoLogout'),
          key: 'autoLogout',
          description: t('logoutAfterInactivity')
        }
      ]
    },
    {
      title: t('language'),
      icon: LanguageIcon,
      color: 'indigo',
      settings: [
        {
          label: t('language'),
          key: 'language',
          description: t('selectInterfaceLanguage')
        }
      ]
    }
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
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <CogIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{t('settings')}</h1>
              <p className="text-gray-600 dark:text-gray-400">Configurez votre expérience</p>
            </div>
          </div>
        </motion.div>

        {/* Settings Sections */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-6"
        >
          {settingSections.map((section, sectionIdx) => {
            const Icon = section.icon;
            const colorMap = {
              blue: 'from-blue-500 to-cyan-500',
              purple: 'from-purple-500 to-pink-500',
              green: 'from-green-500 to-emerald-500',
              indigo: 'from-indigo-500 to-blue-500'
            };

            return (
              <motion.div key={sectionIdx} variants={staggerItem}>
                <Card hover shadow="lg">
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className={`p-3 bg-gradient-to-br ${colorMap[section.color]} rounded-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{section.title}</h2>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {section.settings.map((setting, settingIdx) => (
                      <div key={settingIdx} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{setting.label}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{setting.description}</p>
                        </div>
                        {setting.key === 'language' ? (
                          <select
                            value={settings[setting.key]}
                            onChange={(e) => {
                              updateSetting('language', e.target.value);
                              setLocalSettings(prev => ({ ...prev, language: e.target.value }));
                            }}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white cursor-pointer font-medium"
                          >
                            <option value="fr">{t('french')}</option>
                            <option value="en">{t('english')}</option>
                            <option value="ar">{t('arabic')}</option>
                          </select>
                        ) : (
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={localSettings[setting.key]}
                              onChange={() => handleSettingChange(setting.key)}
                              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer dark:bg-gray-700 dark:border-gray-600"
                            />
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={staggerItem}
          initial="initial"
          animate="animate"
          className="mt-8 flex gap-3 justify-between"
        >
          <Button variant="secondary" onClick={() => window.location.reload()}>
            {t('cancel')}
          </Button>
          <Button variant="primary" onClick={handleSaveSettings}>
            {t('saveSettings')}
          </Button>
        </motion.div>

        {/* Help Section */}
        <motion.div
          variants={staggerItem}
          initial="initial"
          animate="animate"
          className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <QuestionMarkCircleIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-300">{t('helpNeeded')}</p>
              <p className="text-sm text-blue-800 dark:text-blue-400 mt-1">
                {t('consultDocumentation')}
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Settings;

