import { useState } from 'react';
import { Eye, EyeOff, LogIn, Shield, HeartPulse } from 'lucide-react';
import { USERS } from '../data/mockData';
import Spinner from '../components/Spinner';

export default function LoginScreen({ onLogin, showToast }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simula petición al backend · 1200ms de latencia
    setTimeout(() => {
      const user = USERS.find(
        (u) => u.email === email.trim() && u.password === password
      );
      if (user) {
        showToast({ type: 'success', title: `Bienvenido, ${user.name}`, message: 'Sesión iniciada correctamente' });
        onLogin(user);
      } else {
        setError('Credenciales incorrectas. Verifique su correo y contraseña.');
        showToast({ type: 'error', title: 'Acceso denegado', message: 'Credenciales inválidas' });
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL — Brandside */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #1e4f5c 0%, #367281 55%, #4a8fa0 100%)' }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: '#66AB1A', transform: 'translate(40%, -40%)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ background: '#66AB1A', transform: 'translate(-40%, 40%)' }} />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <HeartPulse size={22} className="text-white" />
          </div>
          <div>
            <p className="text-white font-display font-bold text-lg leading-none">HAV</p>
            <p className="text-white/70 text-xs">Hospital Adventista de Venezuela</p>
          </div>
        </div>

        {/* Middle text */}
        <div className="relative z-10">
          <h1 className="text-white font-display font-bold text-5xl leading-tight mb-4">
            Portal Interno<br />para el Personal
          </h1>
          <p className="text-white/75 text-lg leading-relaxed max-w-sm">
            Excelencia en la gestión clínica y administrativa para una mejor atención al paciente.
          </p>

          {/* Features list */}
          <div className="mt-10 space-y-3">
            {[
              'Historias clínicas digitales SOAP',
              'Gestión de citas en tiempo real',
              'Control de acceso por roles',
              'Reportes y estadísticas avanzadas',
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-hav-secondary" />
                <p className="text-white/80 text-sm">{f}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <p className="text-white/40 text-xs relative z-10">
          © 2024 Hospital Adventista de Venezuela · v2.4.0
        </p>
      </div>

      {/* RIGHT PANEL — Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-hav-primary rounded-xl flex items-center justify-center">
            <HeartPulse size={22} className="text-white" />
          </div>
          <p className="font-display font-bold text-xl text-hav-primary">HAV Portal</p>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-display font-bold text-hav-text-main">Acceso Staff</h2>
            <p className="text-hav-text-muted mt-1">Ingrese sus credenciales corporativas</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-hav-text-muted mb-1.5" htmlFor="login-email">
                Correo institucional
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@hav.edu.ve"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-hav-text-main placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-hav-primary/30 focus:border-hav-primary transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-hav-text-muted" htmlFor="login-password">
                  Contraseña
                </label>
                <button type="button" className="text-xs text-hav-primary hover:underline">
                  ¿Problemas con su cuenta?
                </button>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-hav-text-main placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-hav-primary/30 focus:border-hav-primary transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-hav-text-muted hover:text-hav-primary transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-hav-danger text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              id="btn-login"
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 bg-hav-primary hover:bg-hav-primary-dark disabled:opacity-70 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 mt-2 shadow-lg shadow-hav-primary/20"
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Iniciar Sesión</span>
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-xs font-semibold text-hav-text-muted mb-2 flex items-center gap-1.5">
              <Shield size={12} /> Credenciales de demostración
            </p>
            <div className="space-y-1.5">
              {[
                { label: 'Super Admin', email: 'admin@hav.edu.ve', pass: 'admin123' },
                { label: 'Recepción', email: 'recepcion@hav.edu.ve', pass: 'recepcion123' },
                { label: 'Médico', email: 'medico@hav.edu.ve', pass: 'medico123' },
              ].map(({ label, email: e, pass }) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => { setEmail(e); setPassword(pass); }}
                  className="w-full flex items-center justify-between text-xs px-3 py-2 bg-white hover:bg-hav-primary/5 border border-gray-100 rounded-lg transition-colors text-left"
                >
                  <span className="font-medium text-hav-primary">{label}</span>
                  <span className="text-hav-text-muted">{e}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-hav-text-muted mt-6">
            Sistema exclusivo para personal autorizado HAV.<br />
            El acceso no autorizado está prohibido.
          </p>
        </div>
      </div>
    </div>
  );
}
