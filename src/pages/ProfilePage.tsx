import { useState } from 'react';
import { User, Mail, Phone, MapPin, Package, Heart, Edit2, Save, X, Star } from 'lucide-react';
import { useStore } from '../store/useStore';
import { PageType } from '../types';
import { products } from '../data/products';
import toast from 'react-hot-toast';

interface ProfilePageProps {
  onNavigate: (page: PageType) => void;
  onViewProduct: (product: any) => void;
}

export default function ProfilePage({ onNavigate, onViewProduct }: ProfilePageProps) {
  const { currentUser, updateUser, wishlist, orders, isAuthenticated } = useStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    city: currentUser?.city || '',
  });

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-950 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-white font-bold text-xl mb-2">Connexion requise</h2>
          <p className="text-gray-400 mb-6">Vous devez être connecté pour accéder à votre profil.</p>
          <button onClick={() => onNavigate('login')} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all">
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    updateUser(form);
    setEditing(false);
    toast.success('Profil mis à jour !', {
      style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' },
    });
  };

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const tabs = [
    { id: 'profile', label: 'Mon profil', icon: <User size={15} /> },
    { id: 'orders', label: `Commandes (${orders.length})`, icon: <Package size={15} /> },
    { id: 'wishlist', label: `Favoris (${wishlist.length})`, icon: <Heart size={15} /> },
  ];

  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: 'En attente', color: 'text-yellow-400 bg-yellow-400/10' },
    confirmed: { label: 'Confirmée', color: 'text-blue-400 bg-blue-400/10' },
    shipped: { label: 'Expédiée', color: 'text-purple-400 bg-purple-400/10' },
    delivered: { label: 'Livrée', color: 'text-green-400 bg-green-400/10' },
    cancelled: { label: 'Annulée', color: 'text-red-400 bg-red-400/10' },
  };

  return (
    <div className="bg-gray-950 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-violet-900/40 border border-white/10 rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: `url('/images/hero-bg.jpg')`, backgroundSize: 'cover' }}
          />
          <div className="relative flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-blue-500/30 shrink-0">
              {currentUser?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-black text-white mb-1">{currentUser?.name}</h1>
              <p className="text-gray-400 text-sm mb-2">{currentUser?.email}</p>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  currentUser?.role === 'admin'
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {currentUser?.role === 'admin' ? '👑 Administrateur' : '👤 Client'}
                </span>
                {currentUser?.city && (
                  <span className="flex items-center gap-1 text-gray-400 text-xs">
                    <MapPin size={11} /> {currentUser.city}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-900 border border-white/5 rounded-2xl p-1 mb-8 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="bg-gray-900 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-bold text-lg">Informations personnelles</h2>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-white/10 rounded-xl text-gray-300 text-sm hover:text-white transition-all"
                >
                  <Edit2 size={14} /> Modifier
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-500 transition-all">
                    <Save size={14} /> Sauvegarder
                  </button>
                  <button onClick={() => setEditing(false)} className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-gray-300 text-sm rounded-xl hover:text-white transition-all">
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { label: 'Nom complet', field: 'name', icon: <User size={15} />, value: form.name, type: 'text' },
                { label: 'Email', field: 'email', icon: <Mail size={15} />, value: currentUser?.email || '', type: 'email', disabled: true },
                { label: 'Téléphone', field: 'phone', icon: <Phone size={15} />, value: form.phone, type: 'tel' },
                { label: 'Ville', field: 'city', icon: <MapPin size={15} />, value: form.city, type: 'text' },
              ].map((item) => (
                <div key={item.field}>
                  <label className="block text-gray-400 text-sm mb-1.5">{item.label}</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{item.icon}</div>
                    <input
                      type={item.type}
                      value={item.value}
                      onChange={(e) => editing && !item.disabled && setForm((prev) => ({ ...prev, [item.field]: e.target.value }))}
                      disabled={!editing || item.disabled}
                      className={`w-full bg-gray-800 border rounded-xl pl-9 pr-4 py-3 text-sm outline-none transition-all ${
                        editing && !item.disabled
                          ? 'border-blue-500/50 text-white focus:border-blue-400'
                          : 'border-white/5 text-gray-300 cursor-not-allowed opacity-80'
                      }`}
                    />
                  </div>
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-gray-400 text-sm mb-1.5">Adresse</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-3.5 text-gray-400" />
                  <textarea
                    value={form.address}
                    onChange={(e) => editing && setForm((prev) => ({ ...prev, address: e.target.value }))}
                    disabled={!editing}
                    rows={2}
                    placeholder="Votre adresse complète..."
                    className={`w-full bg-gray-800 border rounded-xl pl-9 pr-4 py-3 text-sm outline-none transition-all resize-none ${
                      editing
                        ? 'border-blue-500/50 text-white focus:border-blue-400'
                        : 'border-white/5 text-gray-300 cursor-not-allowed opacity-80'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">📦</div>
                <h3 className="text-white font-bold text-lg mb-2">Aucune commande</h3>
                <p className="text-gray-400 mb-6">Vous n'avez pas encore passé de commande.</p>
                <button onClick={() => onNavigate('catalog')} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all">
                  Commencer mes achats
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const status = statusConfig[order.status] || statusConfig.pending;
                  return (
                    <div key={order.id} className="bg-gray-900 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-blue-400 font-mono font-semibold">{order.id}</p>
                          <p className="text-gray-400 text-xs mt-0.5">{new Date(order.date).toLocaleDateString('fr-TN')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-black text-lg">{order.total.toLocaleString()} DT</p>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {order.items.slice(0, 3).map((item) => (
                          <div key={item.product.id} className="flex items-center gap-2 bg-gray-800 rounded-xl px-3 py-2">
                            <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-700">
                              <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-gray-300 text-xs max-w-32 truncate">{item.product.name}</span>
                            <span className="text-gray-500 text-xs">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-gray-400 text-xs">
                        <MapPin size={11} /> {order.shippingAddress}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* WISHLIST TAB */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">❤️</div>
                <h3 className="text-white font-bold text-lg mb-2">Aucun favori</h3>
                <p className="text-gray-400 mb-6">Ajoutez des produits à vos favoris pour les retrouver facilement.</p>
                <button onClick={() => onNavigate('catalog')} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all">
                  Explorer le catalogue
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlistProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => onViewProduct(product)}
                    className="flex gap-3 bg-gray-900 border border-white/5 rounded-2xl p-4 hover:border-blue-500/30 transition-all cursor-pointer group"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-800 shrink-0">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-blue-400 text-xs font-semibold mb-0.5">{product.brand}</p>
                      <p className="text-white text-sm font-semibold line-clamp-2 leading-tight">{product.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star size={10} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-gray-400 text-xs">{product.rating}</span>
                      </div>
                      <p className="text-blue-400 font-bold text-sm mt-1">{product.price.toLocaleString()} DT</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
