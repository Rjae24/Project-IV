import { useState } from 'react';
import { CalendarDays, Users, CreditCard, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { APPOINTMENTS, PATIENTS } from '../../data/mockData';
import Spinner from '../../components/Spinner';

const today = '2024-10-04';
const todayAppts = APPOINTMENTS.filter((a) => a.date === today);

const PAYMENTS_MOCK = [
  { id: 'pay1', patientName: 'Eduardo San Vicente', amount: 45000, concept: 'Consulta Cardiología', status: 'pagado', time: '08:30' },
  { id: 'pay2', patientName: 'Roberto Castellanos', amount: 35000, concept: 'Medicina General', status: 'pendiente', time: '10:15' },
  { id: 'pay3', patientName: 'María Gabriela Díaz', amount: 50000, concept: 'Ginecología', status: 'pagado', time: '09:45' },
];

export default function RecepcionDashboard({ user, onNavigate, showToast }) {
  const [appointments, setAppointments] = useState(todayAppts);
  const [payments, setPayments] = useState(PAYMENTS_MOCK);
  const [processingId, setProcessingId] = useState(null);

  const confirmAppt = (id) => {
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: 'confirmada' } : a));
    showToast({ type: 'success', title: 'Cita confirmada', message: 'Estado actualizado en el sistema' });
  };

  const processPayment = (id, patientName) => {
    setProcessingId(id);
    setTimeout(() => {
      setPayments((prev) => prev.map((p) => p.id === id ? { ...p, status: 'pagado' } : p));
      setProcessingId(null);
      showToast({ type: 'success', title: '💳 Pago procesado', message: `${patientName} · Factura generada` });
    }, 1300);
  };

  return (
    <div className="p-6 space-y-5 view-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-hav-text-main">Panel de Recepción</h1>
          <p className="text-hav-text-muted text-sm mt-0.5">
            Viernes, 4 de oct. 2024 · {user.name}
          </p>
        </div>
        <button
          onClick={() => onNavigate('appointments')}
          className="flex items-center gap-2 bg-hav-primary hover:bg-hav-primary-dark text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-md shadow-hav-primary/20"
        >
          <Plus size={16} /> Nueva Cita
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Citas Hoy', value: appointments.length, icon: CalendarDays, color: 'bg-hav-primary' },
          { label: 'Confirmadas', value: appointments.filter((a) => a.status === 'confirmada').length, icon: CheckCircle, color: 'bg-hav-secondary' },
          { label: 'En Espera', value: appointments.filter((a) => a.status === 'en_espera').length, icon: Clock, color: 'bg-amber-400' },
          { label: 'Atendidos', value: 18, icon: Users, color: 'bg-indigo-500' },
        ].map(({ label, value, icon: I, color }) => (
          <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex items-center gap-3">
            <div className={`${color} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`}>
              <I size={18} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-hav-text-main">{value}</p>
              <p className="text-xs text-hav-text-muted">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Today's appointments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-hav-text-main">Citas de Hoy</h3>
            <button onClick={() => onNavigate('appointments')} className="text-xs text-hav-primary hover:underline">Ver calendario →</button>
          </div>
          <div className="space-y-3">
            {appointments.map((a) => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-hav-primary/5 transition-colors">
                <div className="w-9 h-9 rounded-full bg-hav-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {a.patientName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-hav-text-main truncate">{a.patientName}</p>
                  <p className="text-xs text-hav-text-muted truncate">{a.specialty} · {a.time}</p>
                </div>
                {a.status === 'confirmada' ? (
                  <span className="flex items-center gap-1 text-[10px] text-hav-secondary font-semibold bg-green-50 px-2 py-1 rounded-full flex-shrink-0">
                    <CheckCircle size={10} /> OK
                  </span>
                ) : (
                  <button
                    onClick={() => confirmAppt(a.id)}
                    className="text-xs bg-hav-primary text-white px-3 py-1.5 rounded-full hover:bg-hav-primary-dark transition-colors flex-shrink-0"
                  >
                    Confirmar
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Caja / Payments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-hav-text-main">Módulo de Caja</h3>
            <CreditCard size={16} className="text-hav-text-muted" />
          </div>
          <div className="space-y-3">
            {payments.map((pay) => (
              <div key={pay.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-hav-text-main truncate">{pay.patientName}</p>
                  <p className="text-xs text-hav-text-muted">{pay.concept} · {pay.time}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-hav-text-main">Bs. {pay.amount.toLocaleString()}</p>
                  {pay.status === 'pagado' ? (
                    <span className="text-[10px] text-hav-secondary font-semibold">✓ Pagado</span>
                  ) : (
                    <button
                      onClick={() => processPayment(pay.id, pay.patientName)}
                      disabled={processingId === pay.id}
                      className="flex items-center gap-1 text-[10px] bg-hav-secondary text-white px-2.5 py-1 rounded-full hover:bg-hav-secondary-dark disabled:opacity-60 transition-colors mt-0.5"
                    >
                      {processingId === pay.id ? <><Spinner size="sm" color="white" /> Procesando</> : '💳 Cobrar'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm text-hav-text-muted font-medium">Total recaudado hoy</span>
            <span className="text-xl font-display font-bold text-hav-primary">
              Bs. {payments.filter((p) => p.status === 'pagado').reduce((s, p) => s + p.amount, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
