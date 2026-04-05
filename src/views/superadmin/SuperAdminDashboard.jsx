import { Users, CalendarDays, TrendingUp, UserCheck, Activity, Clock } from 'lucide-react';
import { PATIENTS, APPOINTMENTS, STAFF, RECENT_ACTIVITY } from '../../data/mockData';

const STAT_CARDS = [
  { label: 'Pacientes Atendidos Hoy', value: '1,284', delta: '+12%', icon: Users, color: 'bg-hav-primary' },
  { label: 'Personal Activo', value: '342', delta: '+3', icon: UserCheck, color: 'bg-hav-secondary' },
  { label: 'Citas Programadas', value: APPOINTMENTS.length, delta: 'hoy', icon: CalendarDays, color: 'bg-indigo-500' },
  { label: 'Nuevos Registros', value: '12', delta: 'esta semana', icon: TrendingUp, color: 'bg-amber-500' },
];

const SPECIALTIES = [
  { name: 'Cardiología', count: 38, max: 50 },
  { name: 'Medicina Interna', count: 24, max: 50 },
  { name: 'Ginecología', count: 19, max: 50 },
  { name: 'Pediatría', count: 15, max: 50 },
  { name: 'Traumatología', count: 11, max: 50 },
];

const ROLE_LABELS = {
  recepcion: 'Recepción',
  enfermeria: 'Enfermería',
  administrativo: 'Administrativo',
  medico: 'Médico',
};

export default function SuperAdminDashboard({ user, onNavigate, showToast }) {
  const activeStaff = STAFF.filter((s) => s.status === 'activo');

  return (
    <div className="p-6 space-y-6 view-enter">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-hav-text-main">Resumen General</h1>
          <p className="text-hav-text-muted text-sm mt-0.5">Viernes, 4 de octubre 2024 · Sistema en línea</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-hav-secondary rounded-full animate-pulse" />
          <span className="text-xs text-hav-text-muted font-medium">Tiempo real</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ label, value, delta, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm text-hav-text-muted font-medium leading-tight max-w-[120px]">{label}</p>
              <div className={`${color} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} className="text-white" />
              </div>
            </div>
            <p className="text-3xl font-display font-bold text-hav-text-main">{value}</p>
            <p className="text-xs text-hav-text-muted mt-1">{delta}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Specialty chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-hav-text-main">Flujo por Especialidad</h3>
              <p className="text-xs text-hav-text-muted">Análisis comparativo semanal</p>
            </div>
            <Activity size={16} className="text-hav-text-muted" />
          </div>
          <div className="space-y-4">
            {SPECIALTIES.map(({ name, count, max }) => (
              <div key={name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-hav-text-main">{name}</span>
                  <span className="text-hav-text-muted">{count} pacientes</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-hav-primary rounded-full transition-all duration-700"
                    style={{ width: `${(count / max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Citas mensuales progress */}
          <div className="mt-5 pt-4 border-t border-gray-50">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-hav-text-main">Citas Mensuales</span>
              <span className="text-hav-secondary font-semibold">1,847 / 2,500</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-hav-secondary to-hav-secondary-dark" style={{ width: '73.9%' }} />
            </div>
            <p className="text-xs text-hav-text-muted mt-1.5">Objetivo institucional: 2,500 citas</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-hav-text-main">Actividad Reciente</h3>
              <p className="text-xs text-hav-text-muted">Registro en tiempo real</p>
            </div>
            <Clock size={16} className="text-hav-text-muted" />
          </div>
          <div className="space-y-4">
            {RECENT_ACTIVITY.map((act) => (
              <div key={act.id} className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-hav-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {act.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-hav-text-main">{act.action}</p>
                  <p className="text-xs text-hav-text-muted truncate">{act.detail}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Staff quick list */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-hav-text-main">Personal Activo</h3>
          <button
            onClick={() => onNavigate('staff')}
            className="text-xs text-hav-primary hover:underline font-medium"
          >
            Ver todo →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeStaff.map((s) => (
            <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-hav-primary/5 transition-colors">
              <div className="w-9 h-9 rounded-full bg-hav-primary text-white text-xs font-bold flex items-center justify-center">
                {s.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-hav-text-main truncate">{s.name}</p>
                <p className="text-xs text-hav-text-muted">{ROLE_LABELS[s.role]}</p>
              </div>
              <div className="ml-auto w-2 h-2 rounded-full bg-hav-secondary flex-shrink-0" title="Activo" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
