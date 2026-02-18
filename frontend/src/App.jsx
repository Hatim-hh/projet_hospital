import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { SettingsProvider } from './context/SettingsContext';
import AppRoutes from './routes/AppRoutes';
import Toast from './components/common/Toast';

function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <ToastProvider>
          <AuthProvider>
            <AppRoutes />
            <Toast />
          </AuthProvider>
        </ToastProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
}

export default App;