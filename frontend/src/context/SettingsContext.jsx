import { createContext, useState, useContext, useEffect } from 'react';

const SettingsContext = createContext();

// Translation dictionary
const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    patients: 'Patients',
    rendezvous: 'Appointments',
    consultations: 'Consultations',
    settings: 'Settings',
    profile: 'Profile',
    logout: 'Logout',
    myProfile: 'My Profile',
    
    // Settings
    darkMode: 'Dark Mode',
    language: 'Language',
    french: 'Français',
    english: 'English',
    arabic: 'العربية',
    notifications: 'Notifications',
    emailNotifications: 'Email Notifications',
    smsNotifications: 'SMS Notifications',
    security: 'Security',
    autoLogout: 'Auto Logout',
    appearance: 'Appearance',
    saveSettings: 'Save Settings',
    cancel: 'Cancel',
    
    // General
    welcome: 'Welcome!',
    addNew: 'Add New',
    edit: 'Edit',
    delete: 'Delete',
    search: 'Search',
    noData: 'No data found',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    confirm: 'Confirm',
    close: 'Close',
    
    // Dashboard
    totalPatients: 'Total Patients',
    appointmentsToday: 'Appointments Today',
    consultations: 'Consultations',
    monthlyRevenue: 'Monthly Revenue',
    recentActivity: 'Recent Activity',
    lastLogin: 'Last Login: Today',
    systemUp: 'System Up to Date',
    quickActions: 'Quick Actions',
    overview: 'System overview for your medical clinic',
    
    // Forms
    email: 'Email',
    password: 'Password',
    name: 'Name',
    firstName: 'First Name',
    lastName: 'Last Name',
    phone: 'Phone',
    address: 'Address',
    date: 'Date',
    description: 'Description',
    
    // Login
    login: 'Login',
    signingIn: 'Signing in...',
    connectToContinue: 'Sign in to continue',
    testAccount: 'Test Account',
    allRightsReserved: 'All rights reserved',
    emailAddress: 'Email Address',
    
    // Settings descriptions
    receiveEmailAlerts: 'Receive alerts by email',
    receiveSmsAlerts: 'Receive alerts by SMS',
    enableDarkTheme: 'Enable dark theme',
    selectInterfaceLanguage: 'Select the interface language',
    logoutAfterInactivity: 'Log out after inactivity',
    helpNeeded: 'Need Help?',
    consultDocumentation: 'Consult our documentation or contact support for more information about available settings',
  },
  fr: {
    // Navigation
    dashboard: 'Tableau de bord',
    patients: 'Patients',
    rendezvous: 'Rendez-vous',
    consultations: 'Consultations',
    settings: 'Paramètres',
    profile: 'Profil',
    logout: 'Déconnexion',
    myProfile: 'Mon Profil',
    
    // Settings
    darkMode: 'Mode sombre',
    language: 'Langue',
    french: 'Français',
    english: 'English',
    arabic: 'العربية',
    notifications: 'Notifications',
    emailNotifications: 'Notifications par email',
    smsNotifications: 'Notifications SMS',
    security: 'Sécurité',
    autoLogout: 'Déconnexion automatique',
    appearance: 'Apparence',
    saveSettings: 'Enregistrer les modifications',
    cancel: 'Annuler',
    
    // General
    welcome: 'Bienvenue !',
    addNew: 'Ajouter nouveau',
    edit: 'Modifier',
    delete: 'Supprimer',
    search: 'Rechercher',
    noData: 'Aucune donnée trouvée',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    confirm: 'Confirmer',
    close: 'Fermer',
    
    // Dashboard
    totalPatients: 'Total Patients',
    appointmentsToday: 'RDV Aujourd\'hui',
    consultations: 'Consultations',
    monthlyRevenue: 'Revenu Mensuel',
    recentActivity: 'Activité récente',
    lastLogin: 'Dernière connexion : Aujourd\'hui',
    systemUp: 'Système à jour',
    quickActions: 'Actions rapides',
    overview: 'Vue d\'ensemble de votre clinique',
    
    // Forms
    email: 'Email',
    password: 'Mot de passe',
    name: 'Nom',
    firstName: 'Prénom',
    lastName: 'Nom de famille',
    phone: 'Téléphone',
    address: 'Adresse',
    date: 'Date',
    description: 'Description',
    
    // Login
    login: 'Se connecter',
    signingIn: 'Connexion en cours...',
    connectToContinue: 'Connectez-vous pour continuer',
    testAccount: 'Compte de test',
    allRightsReserved: 'Tous droits réservés',
    emailAddress: 'Adresse email',
    
    // Settings descriptions
    receiveEmailAlerts: 'Recevoir les alertes par email',
    receiveSmsAlerts: 'Recevoir les alertes par SMS',
    enableDarkTheme: 'Activer le thème sombre',
    selectInterfaceLanguage: 'Sélectionner la langue de l\'interface',
    logoutAfterInactivity: 'Se déconnecter après inactivité',
    helpNeeded: 'Besoin d\'aide ?',
    consultDocumentation: 'Consultez notre documentation ou contactez le support pour plus d\'informations sur les paramètres disponibles',
  },
  ar: {
    // Navigation
    dashboard: 'لوحة التحكم',
    patients: 'المرضى',
    rendezvous: 'المواعيد',
    consultations: 'الاستشارات',
    settings: 'الإعدادات',
    profile: 'الملف الشخصي',
    logout: 'تسجيل الخروج',
    myProfile: 'ملفي الشخصي',
    
    // Settings
    darkMode: 'الوضع الداكن',
    language: 'اللغة',
    french: 'Français',
    english: 'English',
    arabic: 'العربية',
    notifications: 'الإخطارات',
    emailNotifications: 'إخطارات البريد الإلكتروني',
    smsNotifications: 'إخطارات SMS',
    security: 'الأمان',
    autoLogout: 'تسجيل خروج تلقائي',
    appearance: 'المظهر',
    saveSettings: 'حفظ التغييرات',
    cancel: 'إلغاء',
    
    // General
    welcome: 'أهلا وسهلا!',
    addNew: 'إضافة جديد',
    edit: 'تعديل',
    delete: 'حذف',
    search: 'بحث',
    noData: 'لم يتم العثور على بيانات',
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجاح',
    confirm: 'تأكيد',
    close: 'إغلاق',
    
    // Dashboard
    totalPatients: 'إجمالي المرضى',
    appointmentsToday: 'المواعيد اليوم',
    consultations: 'الاستشارات',
    monthlyRevenue: 'الإيرادات الشهرية',
    recentActivity: 'النشاط الأخير',
    lastLogin: 'آخر تسجيل دخول: اليوم',
    systemUp: 'النظام محدث',
    quickActions: 'الإجراءات السريعة',
    overview: 'نظرة عامة على عيادتك الطبية',
    
    // Forms
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    name: 'الاسم',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    phone: 'الهاتف',
    address: 'العنوان',
    date: 'التاريخ',
    description: 'الوصف',
    
    // Login
    login: 'تسجيل الدخول',
    signingIn: 'جاري تسجيل الدخول...',
    connectToContinue: 'قم بتسجيل الدخول للمتابعة',
    testAccount: 'حساب الاختبار',
    allRightsReserved: 'جميع الحقوق محفوظة',
    emailAddress: 'عنوان البريد الإلكتروني',
    
    // Settings descriptions
    receiveEmailAlerts: 'استقبال التنبيهات عبر البريد الإلكتروني',
    receiveSmsAlerts: 'استقبال التنبيهات عبر SMS',
    enableDarkTheme: 'تفعيل الوضع الداكن',
    selectInterfaceLanguage: 'اختر لغة الواجهة',
    logoutAfterInactivity: 'تسجيل الخروج بعد عدم النشاط',
    helpNeeded: 'هل تحتاج إلى مساعدة؟',
    consultDocumentation: 'راجع وثائقنا أو اتصل بالدعم للحصول على مزيد من المعلومات حول الإعدادات المتاحة',
  }
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('clinicSettings');
    return saved ? JSON.parse(saved) : {
      darkMode: false,
      language: 'fr',
      emailNotifications: true,
      smsNotifications: false,
      autoLogout: true,
      theme: 'blue'
    };
  });

  // Apply dark mode to the entire app
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Apply language direction for Arabic
  useEffect(() => {
    if (settings.language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = settings.language;
    }
  }, [settings.language]);

  const updateSetting = (key, value) => {
    setSettings(prev => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem('clinicSettings', JSON.stringify(updated));
      return updated;
    });
  };

  const translate = (key) => {
    const translation = translations[settings.language]?.[key];
    if (!translation) {
      console.warn(`Missing translation for key: ${key} in language: ${settings.language}`);
      return translations['fr']?.[key] || key;
    }
    return translation;
  };

  const t = translate;

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, translate, t }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};
