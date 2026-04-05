import { useState } from 'react';
import { Search, Plus, MoreVertical, Pencil, Trash2, Mail, Phone, Badge } from 'lucide-react';
import { STAFF } from '../../data/mockData';

const ROLE_LABELS = { recepcion: 'Recepción', enfermeria: 'Enfermería', administrativo: 'Administrativo', medico: 'Médico' };
const STATUS_STYLES = {
  activo: 'bg-green-100 text-green-700',
  licencia: 'bg-amber-100 text-amber-700',
  inactivo: 'bg-red-100 text-red-700',
};

export default function StaffManagement({ showToast }) {
  const [staff, setStaff] = useState(STAFF);
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'recepcion', status: 'activo' });

  const filtered = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.name || !form.email) return;
    const newMember = { ...form, id: `s${Date.now()}`, since: new Date().toISOString().slice(0, 10) };
    setStaff((prev) => [...prev, newMember]);
    setForm({ name: '', email: '', role: 'recepcion', status: 'activo' });
    setShowModal(false);
    showToast({ type: 'success', title: 'Staff registrado', message: `${form.name} agregado al sistema` });
  };

  const handleDelete = (id, name) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
    setMenuOpen(null);
    showToast({ type: 'warning', title: 'Miembro eliminado', message: `${name} fue removido del sistema` });
  };

  return (
    <div className="p-6 space-y-5 view-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-hav-text-main">Gestión de Staff</h1>
          <p className="text-hav-text-muted text-sm mt-0.5">{staff.length} miembros del equipo</p>
        </div>
        <button
          id="btn-add-staff"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-hav-primary hover:bg-hav-primary-dark text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-md shadow-hav-primary/20"
        >
          <Plus size={16} /> Agregar Staff
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-hav-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o correo..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-hav-text-main placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-hav-primary/30 focus:border-hav-primary"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-hav-text-muted">
            <Badge size={36} className="mb-3 opacity-30" />
            <p className="font-medium">No se encontró personal con ese criterio.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-hav-text-muted uppercase tracking-wide">Nombre</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-hav-text-muted uppercase tracking-wide hidden md:table-cell">Correo</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-hav-text-muted uppercase tracking-wide">Rol</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-hav-text-muted uppercase tracking-wide">Estado</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-hav-primary text-white text-xs font-bold flex items-center justify-center">
                        {s.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="font-medium text-hav-text-main text-sm">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell text-sm text-hav-text-muted">{s.email}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs bg-hav-primary/10 text-hav-primary font-medium px-2 py-1 rounded-full">{ROLE_LABELS[s.role]}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${STATUS_STYLES[s.status]}`}>{s.status}</span>
                  </td>
                  <td className="px-5 py-3.5 relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === s.id ? null : s.id)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-hav-text-muted transition-colors"
                    >
                      <MoreVertical size={15} />
                    </button>
                    {menuOpen === s.id && (
                      <div className="absolute right-8 top-2 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-1 w-36 animate-fadeIn">
                        <button className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 text-hav-text-main">
                          <Pencil size={13} /> Editar
                        </button>
                        <button
                          onClick={() => handleDelete(s.id, s.name)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-red-50 text-hav-danger"
                        >
                          <Trash2 size={13} /> Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal agregar */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">
            <h2 className="text-lg font-display font-bold text-hav-text-main mb-5">Agregar Miembro de Staff</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-hav-text-muted block mb-1">Nombre completo</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nombre Apellido"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hav-primary/30 focus:border-hav-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-hav-text-muted block mb-1">Correo institucional</label>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="usuario@hav.edu.ve"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hav-primary/30 focus:border-hav-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-hav-text-muted block mb-1">Rol</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hav-primary/30"
                  >
                    <option value="recepcion">Recepción</option>
                    <option value="enfermeria">Enfermería</option>
                    <option value="administrativo">Administrativo</option>
                    <option value="medico">Médico</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-hav-text-muted block mb-1">Estado</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hav-primary/30"
                  >
                    <option value="activo">Activo</option>
                    <option value="licencia">Licencia</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-hav-text-muted text-sm hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 py-2.5 rounded-xl bg-hav-primary text-white text-sm font-semibold hover:bg-hav-primary-dark transition-colors"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
