import { useState, useCallback } from 'react';

// Components
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';

// Views
import LoginScreen from './views/LoginScreen';
import SuperAdminDashboard from './views/superadmin/SuperAdminDashboard';
import StaffManagement from './views/superadmin/StaffManagement';
import RecepcionDashboard from './views/recepcion/RecepcionDashboard';
import MedicoDashboard from './views/medico/MedicoDashboard';
import PatientsView from './views/shared/PatientsView';
import CalendarView from './views/shared/CalendarView';

// ─── Router Helper ──────────────────────────────────────────────────────────
// Devuelve el componente correcto según el rol y la vista actual
function RouteView({ user, currentView, onNavigate, showToast }) {
  const props = { user, onNavigate, showToast };

  // Super Admin routes
  if (user.role === 'superadmin') {
    if (currentView === 'dashboard') return <SuperAdminDashboard {...props} />;
    if (currentView === 'staff')     return <StaffManagement {...props} />;
    if (currentView === 'patients')  return <PatientsView {...props} userRole={user.role} />;
    if (currentView === 'appointments') return <CalendarView {...props} />;
    if (currentView === 'reports')   return <ReportsPlaceholder />;
    if (currentView === 'settings')  return <SettingsPlaceholder />;
  }

  // Recepción routes
  if (user.role === 'recepcion') {
    if (currentView === 'dashboard')    return <RecepcionDashboard {...props} />;
    if (currentView === 'appointments') return <CalendarView {...props} />;
    if (currentView === 'patients')     return <PatientsView {...props} userRole={user.role} />;
    if (currentView === 'caja')         return <CajaPlaceholder />;
  }

  // Médico routes
  if (user.role === 'medico') {
    if (currentView === 'dashboard') return <MedicoDashboard {...props} />;
    if (currentView === 'patients')  return <PatientsView {...props} userRole={user.role} />;
    if (currentView === 'history')   return <PatientsView {...props} userRole={user.role} />;
    if (currentView === 'stats')     return <ReportsPlaceholder />;
  }

  return <NotFound />;
}

// Placeholder views
function ReportsPlaceholder() {
  return (
    <div className="p-6 view-enter">
      <h1 className="text-2xl font-display font-bold text-hav-text-main mb-2">Reportes y Estadísticas</h1>
      <div className="mt-8 bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-50">
        <div className="w-16 h-16 bg-hav-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📊</span>
        </div>
        <p className="text-hav-text-muted font-medium">Módulo de reportes en desarrollo</p>
        <p className="text-sm text-gray-400 mt-1">Se conectará a Supabase en la Fase 2</p>
      </div>
    </div>
  );
}

function SettingsPlaceholder() {
  return (
    <div className="p-6 view-enter">
      <h1 className="text-2xl font-display font-bold text-hav-text-main mb-2">Configuración del Sistema</h1>
      <div className="mt-8 bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-50">
        <div className="w-16 h-16 bg-hav-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚙️</span>
        </div>
        <p className="text-hav-text-muted font-medium">Módulo de configuración en desarrollo</p>
        <p className="text-sm text-gray-400 mt-1">Gestión de roles, permisos y parámetros del hospital</p>
      </div>
    </div>
  );
}

function CajaPlaceholder() {
  return (
    <div className="p-6 view-enter">
      <h1 className="text-2xl font-display font-bold text-hav-text-main mb-2">Módulo de Caja</h1>
      <div className="mt-8 bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-50">
        <div className="w-16 h-16 bg-hav-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">💳</span>
        </div>
        <p className="text-hav-text-muted font-medium">Módulo de caja extendido en desarrollo</p>
        <p className="text-sm text-gray-400 mt-1">El módulo de caja básico está disponible en el Dashboard</p>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="p-6 flex items-center justify-center min-h-96 view-enter">
      <div className="text-center">
        <p className="text-6xl mb-4">🏥</p>
        <p className="text-hav-text-muted font-medium">Vista no encontrada</p>
      </div>
    </div>
  );
}

// ─── Top Header Bar ──────────────────────────────────────────────────────────
function TopBar({ user, currentView }) {
  const viewLabels = {
    dashboard: user.role === 'superadmin' ? 'Resumen General' : user.role === 'medico' ? 'Mis Citas' : 'Panel de Recepción',
    staff: 'Gestión de Staff',
    patients: 'Pacientes',
    appointments: 'Calendario de Citas',
    reports: 'Reportes',
    settings: 'Configuración',
    history: 'Historias Clínicas',
    stats: 'Estadísticas',
    caja: 'Módulo de Caja',
  };

  return (
    <header className="md:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
      <p className="font-display font-bold text-hav-primary text-lg">HAV Portal</p>
      <div className="w-8 h-8 rounded-full bg-hav-primary text-white text-xs font-bold flex items-center justify-center">
        {user.avatar}
      </div>
    </header>
  );
}

// ─── App Root ────────────────────────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);   // null = not logged in
  const [currentView, setCurrentView] = useState('dashboard');
  const [toast, setToast] = useState(null);

  const showToast = useCallback((t) => {
    setToast(t);
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('dashboard');
    showToast({ type: 'success', title: 'Sesión cerrada', message: 'Hasta pronto' });
  };

  const navigate = (view) => {
    setCurrentView(view);
  };

  // ── Not authenticated ──
  if (!currentUser) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} showToast={showToast} />
        {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
      </>
    );
  }

  // ── Authenticated layout ──
  return (
    <div className="flex min-h-screen bg-hav-bg">
      <Sidebar
        user={currentUser}
        currentView={currentView}
        onNavigate={navigate}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar user={currentUser} currentView={currentView} />
        <main className="flex-1 overflow-auto">
          <RouteView
            user={currentUser}
            currentView={currentView}
            onNavigate={navigate}
            showToast={showToast}
          />
        </main>
      </div>

      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
