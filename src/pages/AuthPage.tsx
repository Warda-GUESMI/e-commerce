import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Shield, CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { PageType } from '../types';
import toast from 'react-hot-toast';

interface AuthPageProps {
  mode: 'login' | 'register';
  onNavigate: (page: PageType) => void;
}

// Simulated users database
const mockUsers = [
  { id: 'u-001', name: 'Admin Technova', email: 'admin@technova.tn', password: 'admin123', role: 'admin' as const, phone: '+216 70 123 456', city: 'Tunis' },
  { id: 'u-002', name: 'Mehdi Trabelsi', email: 'mehdi@gmail.com', password: 'user123', role: 'user' as const, phone: '+216 55 678 901', city: 'Tunis' },
];

export default function AuthPage({ mode: initialMode, onNavigate }: AuthPageProps) {
  const { login } = useStore();
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.email) newErrors.email = 'Email requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Email invalide';
    if (!form.password) newErrors.password = 'Mot de passe requis';
    else if (form.password.length < 6) newErrors.password = 'Minimum 6 caractères';
    if (mode === 'register') {
      if (!form.name) newErrors.name = 'Nom requis';
      if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      if (!form.acceptTerms) newErrors.terms = 'Vous devez accepter les conditions';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1000));

    if (mode === 'login') {
      const user = mockUsers.find(
        (u) => u.email === form.email && u.password === form.password
      );
      if (user) {
        login({ id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, city: user.city });
        toast.success(`Bienvenue, ${user.name} ! 👋`, {
          style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' },
        });
        onNavigate(user.role === 'admin' ? 'admin' : 'home');
      } else {
        toast.error('Email ou mot de passe incorrect', {
          style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' },
        });
      }
    } else {
      // Register simulation
      const newUser = {
        id: `u-${Date.now()}`,
        name: form.name,
        email: form.email,
        role: 'user' as const,
        phone: form.phone,
        city: '',
      };
      login(newUser);
      toast.success('Compte créé avec succès ! Bienvenue sur Technova 🎉', {
        style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' },
      });
      onNavigate('home');
    }

    setLoading(false);
  };

  const handleInput = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-violet-900 flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url('/images/hero-bg.jpg')`, backgroundSize: 'cover' }}
        />
        <div className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-600/30 rounded-full blur-3xl" />

        <div className="relative">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <span className="text-white font-black text-xl">T</span>
            </div>
            <span className="text-white font-black text-2xl">Tec<span className="text-blue-300">nova</span></span>
          </button>

          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            {mode === 'login' ? 'Bienvenue\nde retour !' : 'Rejoignez\nTechnova !'}
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed mb-10">
            {mode === 'login'
              ? 'Accédez à votre compte pour gérer vos commandes, favoris et profil.'
              : 'Créez votre compte et profitez d\'une expérience shopping optimale.'}
          </p>

          <div className="space-y-4">
            {[
              { icon: '🚀', title: 'Livraison Express', desc: '24-48h partout en Tunisie' },
              { icon: '🛡️', title: 'Garantie Officielle', desc: 'Tous produits garantis constructeur' },
              { icon: '💳', title: 'Paiement Flexible', desc: 'Paiement à la livraison ou en ligne' },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                  <p className="text-blue-200 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <Shield size={20} className="text-green-300" />
            <p className="text-blue-100 text-sm">
              Connexion sécurisée SSL. Vos données sont protégées.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <button onClick={() => onNavigate('home')} className="flex lg:hidden items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-black text-lg">T</span>
            </div>
            <span className="text-white font-black text-xl">Tec<span className="text-blue-400">nova</span></span>
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2">
              {mode === 'login' ? 'Connexion' : 'Créer un compte'}
            </h1>
            <p className="text-gray-400">
              {mode === 'login'
                ? 'Entrez vos identifiants pour accéder à votre compte.'
                : 'Remplissez le formulaire pour créer votre compte.'}
            </p>
          </div>

          {/* Quick login hints */}
          {mode === 'login' && (
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
              <p className="text-blue-300 text-xs font-semibold mb-2 flex items-center gap-1.5">
                <CheckCircle size={12} />
                Comptes de démonstration :
              </p>
              <div className="space-y-1">
                <p className="text-gray-400 text-xs">👑 Admin: admin@technova.tn / admin123</p>
                <p className="text-gray-400 text-xs">👤 User: mehdi@gmail.com / user123</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Nom complet</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleInput('name', e.target.value)}
                    placeholder="Votre nom complet"
                    className={`w-full bg-gray-900 border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-all ${errors.name ? 'border-red-500' : 'border-white/10'}`}
                  />
                </div>
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">Adresse email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleInput('email', e.target.value)}
                  placeholder="votre@email.com"
                  className={`w-full bg-gray-900 border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-all ${errors.email ? 'border-red-500' : 'border-white/10'}`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Téléphone</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleInput('phone', e.target.value)}
                    placeholder="+216 XX XXX XXX"
                    className="w-full bg-gray-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => handleInput('password', e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-gray-900 border rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-all ${errors.password ? 'border-red-500' : 'border-white/10'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Confirmer le mot de passe</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={(e) => handleInput('confirmPassword', e.target.value)}
                    placeholder="••••••••"
                    className={`w-full bg-gray-900 border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-all ${errors.confirmPassword ? 'border-red-500' : 'border-white/10'}`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            {mode === 'login' && (
              <div className="flex justify-end">
                <button type="button" className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <div
                    onClick={() => handleInput('acceptTerms', !form.acceptTerms)}
                    className={`w-5 h-5 mt-0.5 rounded border flex items-center justify-center shrink-0 transition-all ${
                      form.acceptTerms ? 'bg-blue-600 border-blue-600' : 'border-gray-600 hover:border-blue-500'
                    }`}
                  >
                    {form.acceptTerms && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-gray-400 text-sm">
                    J'accepte les{' '}
                    <span className="text-blue-400 hover:text-blue-300 cursor-pointer">conditions d'utilisation</span>
                    {' '}et la{' '}
                    <span className="text-blue-400 hover:text-blue-300 cursor-pointer">politique de confidentialité</span>
                  </span>
                </label>
                {errors.terms && <p className="text-red-400 text-xs mt-1">{errors.terms}</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg hover:from-blue-500 hover:to-indigo-500 transition-all shadow-xl shadow-blue-500/25 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="text-center text-gray-400 text-sm mt-6">
            {mode === 'login' ? "Pas encore de compte ?" : 'Déjà un compte ?'}
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-blue-400 font-semibold ml-1 hover:text-blue-300 transition-colors"
            >
              {mode === 'login' ? "S'inscrire" : 'Se connecter'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
