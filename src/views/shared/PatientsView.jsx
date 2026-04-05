import { useState } from 'react';
import { Search, Plus, AlertTriangle, Heart, User, Phone, Calendar, X } from 'lucide-react';
import { PATIENTS } from '../../data/mockData';

const STATUS_STYLES = {
  activo: { bg: 'bg-green-100', text: 'text-green-700', label: 'Activo' },
  pendiente: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pendiente' },
  dado_de_alta: { bg: 'bg-gray-100', text: 'text-hav-text-muted', label: 'Alta' },
};

export default function PatientsView({ showToast, userRole }) {
  const [patients, setPatients] = useState(PATIENTS);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', cedula: '', age: '', phone: '', gender: 'Masculino', bloodType: 'O+', insurance: '' });

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.cedula.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!addForm.name || !addForm.cedula) return;
    const newPatient = {
      ...addForm,
      id: `p${Date.now()}`,
      alergias: [],
      status: 'activo',
      lastVisit: new Date().toISOString().slice(0, 10),
      doctor: 'Sin asignar',
      specialty: 'Sin asignar',
      vitalSigns: { bp: '-', hr: '-', temp: '-', spo2: '-', weight: '-', bmi: '-' },
      email: '',
      dob: '',
    };
    setPatients((prev) => [...prev, newPatient]);
    setAddForm({ name: '', cedula: '', age: '', phone: '', gender: 'Masculino', bloodType: 'O+', insurance: '' });
    setShowAddModal(false);
    showToast({ type: 'success', title: 'Paciente registrado', message: `${addForm.name} agregado al sistema` });
  };

  return (
    <div className="p-6 space-y-5 view-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-hav-text-main">Pacientes</h1>
          <p className="text-hav-text-muted text-sm mt-0.5">{patients.length} registros en el sistema</p>
        </div>
        {(userRole === 'superadmin' || userRole === 'recepcion') && (
          <button
            id="btn-add-patient"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-hav-secondary hover:bg-hav-secondary-dark text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-md shadow-hav-secondary/20"
          >
            <Plus size={16} /> Nuevo Paciente
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-hav-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o cédula..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hav-primary/30 focus:border-hav-primary"
        />
      </div>

      {/* Patient Cards Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-hav-text-muted">
          <User size={40} className="mb-3 opacity-30" />
          <p className="font-medium">No se encontraron pacientes con ese criterio.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => {
            const st = STATUS_STYLES[p.status] || STATUS_STYLES.activo;
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 hover:shadow-md hover:border-hav-primary/20 transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-hav-primary text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                      {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-hav-text-main text-sm leading-tight">{p.name}</p>
                      <p className="text-xs text-hav-text-muted">{p.cedula}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${st.bg} ${st.text}`}>{st.label}</span>
                </div>
                <div className="space-y-1.5 text-xs text-hav-text-muted">
                  <div className="flex items-center gap-1.5">
                    <User size={11} /> <span>{p.age} años · {p.gender} · {p.bloodType}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Heart size={11} className="text-hav-primary" /> <span>{p.specialty}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={11} /> <span>Última visita: {p.lastVisit}</span>
                  </div>
                </div>
                {p.alergias.length > 0 && (
                  <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-50">
                    <AlertTriangle size={11} className="text-hav-danger" />
                    <span className="text-xs text-hav-danger font-medium">Alergias: {p.alergias.join(', ')}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Patient Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fadeIn">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-hav-primary text-white font-bold text-lg flex items-center justify-center">
                    {selected.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-hav-text-main">{selected.name}</h2>
                    <p className="text-sm text-hav-text-muted">{selected.cedula} · {selected.age} años</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-hav-text-muted hover:text-hav-text-main p-1">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Vital Signs */}
              <div>
                <h3 className="text-sm font-semibold text-hav-text-muted uppercase tracking-wide mb-3">Signos Vitales</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'T/A', value: selected.vitalSigns.bp, unit: 'mmHg' },
                    { label: 'F.C.', value: selected.vitalSigns.hr, unit: 'bpm' },
                    { label: 'Temp.', value: selected.vitalSigns.temp, unit: '°C' },
                    { label: 'SpO2', value: selected.vitalSigns.spo2, unit: '%' },
                    { label: 'Peso', value: selected.vitalSigns.weight, unit: 'kg' },
                    { label: 'IMC', value: selected.vitalSigns.bmi, unit: '' },
                  ].map(({ label, value, unit }) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-hav-text-muted mb-1">{label}</p>
                      <p className="text-lg font-display font-bold text-hav-primary">{value}</p>
                      <p className="text-[10px] text-hav-text-muted">{unit}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alergias */}
              {selected.alergias.length > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                  <p className="text-sm font-semibold text-hav-danger flex items-center gap-1.5 mb-2">
                    <AlertTriangle size={14} /> Alergias Registradas
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {selected.alergias.map((a) => (
                      <span key={a} className="bg-white border border-red-200 text-hav-danger text-xs font-medium px-2 py-1 rounded-full">{a}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { l: 'Médico tratante', v: selected.doctor },
                  { l: 'Especialidad', v: selected.specialty },
                  { l: 'Tipo de sangre', v: selected.bloodType },
                  { l: 'Seguro', v: selected.insurance },
                  { l: 'Teléfono', v: selected.phone },
                  { l: 'Correo', v: selected.email || '—' },
                ].map(({ l, v }) => (
                  <div key={l}>
                    <p className="text-xs text-hav-text-muted">{l}</p>
                    <p className="font-medium text-hav-text-main mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={() => setSelected(null)}
                className="w-full py-2.5 rounded-xl bg-hav-primary text-white text-sm font-semibold hover:bg-hav-primary-dark transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">
            <h2 className="text-lg font-display font-bold text-hav-text-main mb-5">Registrar Nuevo Paciente</h2>
            <div className="space-y-4">
              {[
                { label: 'Nombre completo', key: 'name', placeholder: 'Nombre Apellido', type: 'text' },
                { label: 'Cédula', key: 'cedula', placeholder: 'V-00.000.000', type: 'text' },
                { label: 'Edad', key: 'age', placeholder: '35', type: 'number' },
                { label: 'Teléfono', key: 'phone', placeholder: '+58 412-000-0000', type: 'tel' },
                { label: 'Seguro médico', key: 'insurance', placeholder: 'Nombre aseguradora', type: 'text' },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label className="text-sm font-medium text-hav-text-muted block mb-1">{label}</label>
                  <input
                    type={type}
                    value={addForm[key]}
                    onChange={(e) => setAddForm({ ...addForm, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hav-primary/30 focus:border-hav-primary"
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-hav-text-muted block mb-1">Género</label>
                  <select value={addForm.gender} onChange={(e) => setAddForm({ ...addForm, gender: e.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none">
                    <option>Masculino</option>
                    <option>Femenino</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-hav-text-muted block mb-1">Tipo de sangre</label>
                  <select value={addForm.bloodType} onChange={(e) => setAddForm({ ...addForm, bloodType: e.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none">
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-hav-text-muted text-sm hover:bg-gray-50">Cancelar</button>
              <button onClick={handleAdd} className="flex-1 py-2.5 rounded-xl bg-hav-secondary text-white text-sm font-semibold hover:bg-hav-secondary-dark">Registrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
