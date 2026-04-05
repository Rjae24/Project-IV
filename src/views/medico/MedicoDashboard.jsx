import { useState } from 'react';
import { AlertTriangle, Heart, FileText, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { PATIENTS, APPOINTMENTS, CLINICAL_HISTORY } from '../../data/mockData';
import Spinner from '../../components/Spinner';

const todayAppts = APPOINTMENTS.filter((a) => a.date === '2024-10-04').slice(0, 4);

export default function MedicoDashboard({ user, showToast }) {
  const [selectedPatientId, setSelectedPatientId] = useState(PATIENTS[0].id);
  const [soap, setSoap] = useState({ subjetivo: '', objetivo: '', analisis: '', plan: '' });
  const [saving, setSaving] = useState(false);
  const [savedHistory, setSavedHistory] = useState(CLINICAL_HISTORY);
  const [expandedHistory, setExpandedHistory] = useState(null);

  const selectedPatient = PATIENTS.find((p) => p.id === selectedPatientId);
  const patientHistory = savedHistory.filter((h) => h.patientId === selectedPatientId);

  const handleSaveSOAP = () => {
    if (!soap.subjetivo && !soap.objetivo) {
      showToast({ type: 'warning', title: 'SOAP incompleto', message: 'Ingrese al menos Subjetivo y Objetivo' });
      return;
    }
    setSaving(true);
    setTimeout(() => {
      const newRecord = {
        id: `h${Date.now()}`,
        patientId: selectedPatientId,
        date: new Date().toISOString().slice(0, 10),
        doctor: user.name,
        diagnosis: soap.analisis || 'Pendiente diagnóstico',
        soap: { ...soap },
        status: 'abierta',
      };
      setSavedHistory((prev) => [newRecord, ...prev]);
      setSoap({ subjetivo: '', objetivo: '', analisis: '', plan: '' });
      setSaving(false);
      showToast({ type: 'success', title: '✅ Historia guardada', message: `Consulta de ${selectedPatient?.name} registrada` });
    }, 1400);
  };

  return (
    <div className="p-6 space-y-5 view-enter">
      <div>
        <h1 className="text-2xl font-display font-bold text-hav-text-main">
          Citas de Hoy
        </h1>
        <p className="text-hav-text-muted text-sm mt-0.5">
          {user.name} · {user.title}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Left: Patient queue */}
        <div className="xl:col-span-2 space-y-4">
          {/* Queue */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-50 p-5">
            <h3 className="font-semibold text-hav-text-main mb-3 text-sm">Cola de Pacientes</h3>
            <div className="space-y-2">
              {todayAppts.map((a) => {
                const patient = PATIENTS.find((p) => p.id === a.patientId);
                const isSelected = patient?.id === selectedPatientId;
                return (
                  <button
                    key={a.id}
                    onClick={() => patient && setSelectedPatientId(patient.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-hav-primary text-white'
                        : 'bg-gray-50 hover:bg-hav-primary/10 text-hav-text-main'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-white/20 text-white' : 'bg-hav-primary text-white'}`}>
                      {a.patientName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${isSelected ? 'text-white' : 'text-hav-text-main'}`}>{a.patientName}</p>
                      <p className={`text-xs truncate ${isSelected ? 'text-white/70' : 'text-hav-text-muted'}`}>{a.time} · {a.type}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Patient Vitals Card */}
          {selectedPatient && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-50 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-hav-primary text-white font-bold text-sm flex items-center justify-center">
                  {selectedPatient.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-hav-text-main">{selectedPatient.name}</p>
                  <p className="text-xs text-hav-text-muted">{selectedPatient.cedula} · {selectedPatient.age} años</p>
                </div>
              </div>

              {selectedPatient.alergias.length > 0 && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3 mb-4">
                  <AlertTriangle size={14} className="text-hav-danger flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-hav-danger font-medium">
                    <span className="font-bold">Alergias: </span>{selectedPatient.alergias.join(', ')}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                {[
                  { l: 'T/A', v: selectedPatient.vitalSigns.bp, u: 'mmHg', alert: false },
                  { l: 'F.C.', v: selectedPatient.vitalSigns.hr, u: 'bpm', alert: selectedPatient.vitalSigns.hr > 90 },
                  { l: 'Temp', v: selectedPatient.vitalSigns.temp, u: '°C', alert: selectedPatient.vitalSigns.temp > 37 },
                  { l: 'SpO2', v: selectedPatient.vitalSigns.spo2, u: '%', alert: selectedPatient.vitalSigns.spo2 < 95 },
                  { l: 'Peso', v: selectedPatient.vitalSigns.weight, u: 'kg', alert: false },
                  { l: 'IMC', v: selectedPatient.vitalSigns.bmi, u: '', alert: selectedPatient.vitalSigns.bmi > 30 },
                ].map(({ l, v, u, alert }) => (
                  <div key={l} className={`rounded-xl p-2.5 text-center ${alert ? 'bg-red-50' : 'bg-gray-50'}`}>
                    <p className="text-[10px] text-hav-text-muted">{l}</p>
                    <p className={`text-base font-display font-bold ${alert ? 'text-hav-danger' : 'text-hav-primary'}`}>{v}</p>
                    <p className="text-[10px] text-hav-text-muted">{u}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: SOAP form + history */}
        <div className="xl:col-span-3 space-y-4">
          {/* SOAP Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={16} className="text-hav-primary" />
              <h3 className="font-semibold text-hav-text-main">Nota SOAP</h3>
            </div>
            <div className="space-y-3">
              {[
                { key: 'subjetivo', label: 'S · Subjetivo', placeholder: 'Motivo de consulta, síntomas referidos por el paciente...' },
                { key: 'objetivo', label: 'O · Objetivo', placeholder: 'Examen físico, signos vitales, hallazgos clínicos...' },
                { key: 'analisis', label: 'A · Análisis / Diagnóstico', placeholder: 'Impresión diagnóstica, diagnóstico diferencial...' },
                { key: 'plan', label: 'P · Plan', placeholder: 'Tratamiento, medicación, interconsultas, próxima cita...' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-hav-primary uppercase tracking-wide block mb-1">{label}</label>
                  <textarea
                    value={soap[key]}
                    onChange={(e) => setSoap({ ...soap, [key]: e.target.value })}
                    placeholder={placeholder}
                    rows={3}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-hav-text-main placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-hav-primary/30 focus:border-hav-primary resize-none transition-all"
                  />
                </div>
              ))}
            </div>
            <button
              id="btn-save-soap"
              onClick={handleSaveSOAP}
              disabled={saving}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-hav-primary hover:bg-hav-primary-dark disabled:opacity-70 text-white font-semibold py-3 rounded-xl transition-all shadow-md shadow-hav-primary/20"
            >
              {saving ? <><Spinner size="sm" /> Guardando...</> : <><Save size={16} /> Guardar Historia Clínica</>}
            </button>
          </div>

          {/* Clinical History */}
          {patientHistory.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-50 p-5">
              <h3 className="font-semibold text-hav-text-main mb-3 text-sm">Historial Clínico</h3>
              <div className="space-y-2">
                {patientHistory.map((h) => (
                  <div key={h.id} className="border border-gray-100 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedHistory(expandedHistory === h.id ? null : h.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-left">
                        <p className="text-sm font-semibold text-hav-text-main">{h.diagnosis}</p>
                        <p className="text-xs text-hav-text-muted">{h.date} · {h.doctor}</p>
                      </div>
                      {expandedHistory === h.id ? <ChevronUp size={15} className="text-hav-text-muted" /> : <ChevronDown size={15} className="text-hav-text-muted" />}
                    </button>
                    {expandedHistory === h.id && (
                      <div className="px-4 pb-4 border-t border-gray-50 space-y-2 bg-gray-50/50">
                        {Object.entries(h.soap).map(([key, val]) => (
                          val && (
                            <div key={key}>
                              <p className="text-[10px] font-bold text-hav-primary uppercase mt-2">{key}</p>
                              <p className="text-xs text-hav-text-main">{val}</p>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
