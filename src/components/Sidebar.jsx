import {
  LayoutDashboard, Users, CalendarDays, BadgeDollarSign,
  ClipboardList, BarChart3, Settings, LogOut, HeartPulse,
  ChevronRight,
} from 'lucide-react';

const NAV_ITEMS = {
  superadmin: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'patients', label: 'Pacientes', icon: ClipboardList },
    { id: 'appointments', label: 'Calendario', icon: CalendarDays },
    { id: 'reports', label: 'Reportes', icon: BarChart3 },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ],
  recepcion: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Calendario', icon: CalendarDays },
    { id: 'patients', label: 'Pacientes', icon: ClipboardList },
    { id: 'caja', label: 'Caja', icon: BadgeDollarSign },
  ],
  medico: [
    { id: 'dashboard', label: 'Mis Citas', icon: CalendarDays },
    { id: 'patients', label: 'Pacientes', icon: ClipboardList },
    { id: 'history', label: 'Historias', icon: ClipboardList },
    { id: 'stats', label: 'Estadísticas', icon: BarChart3 },
  ],
};

export default function Sidebar({ user, currentView, onNavigate, onLogout }) {
  const items = NAV_ITEMS[user.role] || NAV_ITEMS.recepcion;

  const roleLabels = {
    superadmin: 'Super Admin',
    recepcion: 'Recepción',
    medico: 'Médico',
  };

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-white border-r border-gray-100 shadow-sm">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #367281, #1e4f5c)' }}>
            <HeartPulse size={18} className="text-white" />
          </div>
          <div className="leading-none">
            <p className="font-display font-bold text-hav-primary text-base">HAV Portal</p>
            <p className="text-hav-text-muted text-[10px] mt-0.5">{roleLabels[user.role]}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {items.map(({ id, label, icon: Icon }) => {
          const isActive = currentView === id;
          return (
            <button
              key={id}
              id={`nav-${id}`}
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-hav-primary text-white shadow-md shadow-hav-primary/20'
                  : 'text-hav-text-muted hover:bg-hav-primary/8 hover:text-hav-primary'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-white' : 'text-hav-text-muted group-hover:text-hav-primary'} />
              <span className="flex-1 text-left">{label}</span>
              {isActive && <ChevronRight size={14} className="text-white/70" />}
            </button>
          );
        })}
      </nav>

      {/* User Card */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-50">
          <div className="w-8 h-8 rounded-full bg-hav-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
            {user.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-hav-text-main truncate">{user.name}</p>
            <p className="text-[10px] text-hav-text-muted truncate">{user.email}</p>
          </div>
        </div>
        <button
          id="btn-logout"
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 mt-1 rounded-lg text-sm text-hav-text-muted hover:text-hav-danger hover:bg-red-50 transition-all duration-150"
        >
          <LogOut size={15} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
