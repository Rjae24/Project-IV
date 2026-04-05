import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Plus, X, CheckCircle } from 'lucide-react';
import { APPOINTMENTS, PATIENTS } from '../../data/mockData';

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

const STATUS_CONFIG = {
  confirmada: { bg: 'bg-hav-primary/10', text: 'text-hav-primary', dot: 'bg-hav-primary', label: 'Confirmada' },
  en_espera:  { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400', label: 'En espera' },
  pendiente:  { bg: 'bg-gray-100', text: 'text-hav-text-muted', dot: 'bg-gray-400', label: 'Pendiente' },
  completada: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-hav-secondary', label: 'Completada' },
};

function buildCalendar(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export default function CalendarView({ showToast }) {
  const today = new Date();
  const [curYear, setCurYear] = useState(today.getFullYear());
  const [curMonth, setCurMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [appointments, setAppointments] = useState(APPOINTMENTS);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ patientId: PATIENTS[0].id, time: '08:00', type: 'Consulta Nueva', doctor: 'Dr. Ricardo Pérez', specialty: 'Cardiología' });

  const cells = buildCalendar(curYear, curMonth);
  const pad = (n) => String(n).padStart(2, '0');
  const selectedDateStr = `${curYear}-${pad(curMonth + 1)}-${pad(selectedDay)}`;

  const dayAppts = appointments.filter((a) => a.date === selectedDateStr);

  const prevMonth = () => {
    if (curMonth === 0) { setCurMonth(11); setCurYear(y => y - 1); }
    else setCurMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (curMonth === 11) { setCurMonth(0); setCurYear(y => y + 1); }
    else setCurMonth(m => m + 1);
  };

  const handleAdd = () => {
    const patient = PATIENTS.find((p) => p.id === form.patientId);
    const newAppt = {
      id: `a${Date.now()}`,
      patientId: form.patientId,
      patientName: patient?.name || 'Desconocido',
      doctor: form.doctor,
      specialty: form.specialty,
      date: selectedDateStr,
      time: form.time,
      status: 'pendiente',
      type: form.type,
    };
    setAppointments((prev) => [...prev, newAppt]);
    setShowModal(false);
    showToast({ type: 'success', title: '✅ Cita agendada con éxito', message: `${patient?.name} · ${form.time}` });
  };

  const confirmAppt = (id) => {
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: 'confirmada' } : a));
    showToast({ type: 'success', title: 'Cita confirmada', message: 'La cita fue confirmada exitosamente' });
  };

  const hasAppt = (day) => {
    const d = `${curYear}-${pad(curMonth + 1)}-${pad(day)}`;
    return appointments.some((a) => a.date === d);
  };

  return (
    <div className="p-6 space-y-5 view-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-hav-text-main">Calendario de Citas</h1>
          <p className="text-hav-text-muted text-sm mt-0.5">Gestión del flujo hospitalario</p>
        </div>
        <button
          id="btn-add-appointment"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-hav-primary hover:bg-hav-primary-dark text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-md shadow-hav-primary/20"
        >
          <Plus size={16} /> Nueva Cita
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Calendar */}
        <div className="xl:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-50 p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 text-hav-text-muted transition-colors">
              <ChevronLeft size={18} />
            </button>
            <h3 className="font-display font-semibold text-hav-text-main">
              {MONTHS[curMonth]} {curYear}
            </h3>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 text-hav-text-muted transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-semibold text-hav-text-muted py-2">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => (
              <div key={i} className="aspect-square">
                {day && (
                  <button
                    onClick={() => setSelectedDay(day)}
                    className={`w-full h-full rounded-lg text-sm font-medium flex flex-col items-center justify-center relative transition-all ${
                      selectedDay === day
                        ? 'bg-hav-primary text-white shadow-md'
                        : 'hover:bg-gray-50 text-hav-text-main'
                    }`}
                  >
                    {day}
                    {hasAppt(day) && (
                      <span className={`w-1 h-1 rounded-full mt-0.5 ${selectedDay === day ? 'bg-white/70' : 'bg-hav-secondary'}`} />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Day appointments panel */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-50 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-hav-text-main">
              {selectedDay} de {MONTHS[curMonth]}
            </h3>
            <span className="text-xs text-hav-text-muted bg-gray-100 px-2 py-1 rounded-full">
              {dayAppts.length} citas
            </span>
          </div>

          {dayAppts.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-hav-text-muted">
              <Clock size={28} className="mb-2 opacity-30" />
              <p className="text-sm">Sin citas para este día</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {dayAppts.map((a) => {
                const sc = STATUS_CONFIG[a.status] || STATUS_CONFIG.pendiente;
                return (
                  <div key={a.id} className={`rounded-xl p-3.5 ${sc.bg}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sc.dot}`} />
                          <span className={`text-[10px] font-semibold uppercase tracking-wide ${sc.text}`}>{sc.label}</span>
                        </div>
                        <p className="text-sm font-semibold text-hav-text-main">{a.patientName}</p>
                        <p className="text-xs text-hav-text-muted">{a.doctor} · {a.specialty}</p>
                        <p className="text-xs text-hav-text-muted mt-0.5">{a.time} · {a.type}</p>
                      </div>
                      {a.status === 'pendiente' && (
                        <button
                          onClick={() => confirmAppt(a.id)}
                          className="text-hav-primary hover:text-hav-secondary transition-colors flex-shrink-0"
                          title="Confirmar cita"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-display font-bold text-hav-text-main">
                Nueva Cita · {selectedDay} {MONTHS[curMonth]}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-hav-text-muted hover:text-hav-text-main">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-hav-text-muted block mb-1">Paciente</label>
                <select
                  value={form.patientId}
                  onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none"
                >
                  {PATIENTS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-hav-text-muted block mb-1">Hora</label>
                  <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-hav-text-muted block mb-1">Tipo</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none">
                    <option>Consulta Nueva</option>
                    <option>Control</option>
                    <option>Primera Vez</option>
                    <option>Urgencia</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-hav-text-muted block mb-1">Médico</label>
                <select value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none">
                  <option>Dr. Ricardo Pérez</option>
                  <option>Dra. Sofía Blanco</option>
                  <option>Dr. Luis Martínez</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-hav-text-muted text-sm hover:bg-gray-50">Cancelar</button>
              <button onClick={handleAdd} className="flex-1 py-2.5 rounded-xl bg-hav-primary text-white text-sm font-semibold hover:bg-hav-primary-dark">Agendar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
