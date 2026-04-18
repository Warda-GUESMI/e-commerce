import { useState } from 'react';
import {
  BarChart3, Package, ShoppingBag, Users, TrendingUp,
  AlertTriangle, Plus, Edit2, Trash2, Eye, Search,
  ArrowUpRight, ArrowDownRight, DollarSign, Star
} from 'lucide-react';
import { products } from '../data/products';
import { useStore } from '../store/useStore';
import { PageType } from '../types';

interface AdminPageProps {
  onNavigate: (page: PageType) => void;
}

const statsData = [
  { label: 'Revenus du mois', value: '124,580 DT', change: '+18.2%', positive: true, icon: <DollarSign size={20} />, color: 'from-green-500 to-emerald-600' },
  { label: 'Commandes', value: '342', change: '+12.5%', positive: true, icon: <ShoppingBag size={20} />, color: 'from-blue-500 to-indigo-600' },
  { label: 'Produits', value: products.length.toString(), change: '+3 ce mois', positive: true, icon: <Package size={20} />, color: 'from-violet-500 to-purple-600' },
  { label: 'Clients actifs', value: '1,284', change: '+8.1%', positive: true, icon: <Users size={20} />, color: 'from-orange-500 to-amber-600' },
];

const mockOrders = [
  { id: 'TN-A1B2C3', customer: 'Mehdi Trabelsi', city: 'Tunis', total: 4599, status: 'confirmed', date: '2026-06-10', items: 1 },
  { id: 'TN-D4E5F6', customer: 'Amira Ben Salah', city: 'Sfax', total: 1299, status: 'shipped', date: '2026-06-09', items: 2 },
  { id: 'TN-G7H8I9', customer: 'Karim Maaloul', city: 'Sousse', total: 7999, status: 'delivered', date: '2026-06-08', items: 1 },
  { id: 'TN-J0K1L2', customer: 'Sami Bouaziz', city: 'Bizerte', total: 2299, status: 'pending', date: '2026-06-10', items: 3 },
  { id: 'TN-M3N4O5', customer: 'Fatma Hammami', city: 'Monastir', total: 899, status: 'confirmed', date: '2026-06-07', items: 1 },
  { id: 'TN-P6Q7R8', customer: 'Yassine Mejri', city: 'Nabeul', total: 3299, status: 'shipped', date: '2026-06-06', items: 2 },
];

const statusConfig = {
  pending: { label: 'En attente', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  confirmed: { label: 'Confirmée', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  shipped: { label: 'Expédiée', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
  delivered: { label: 'Livrée', color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  cancelled: { label: 'Annulée', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
};

export default function AdminPage({ onNavigate }: AdminPageProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchProduct, setSearchProduct] = useState('');
  const { currentUser } = useStore();

  if (currentUser?.role !== 'admin') {
    return (
      <div className="bg-gray-950 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-white font-bold text-xl mb-2">Accès refusé</h2>
          <p className="text-gray-400 mb-6">Cette page est réservée aux administrateurs.</p>
          <button onClick={() => onNavigate('home')} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchProduct.toLowerCase()) ||
      p.category.toLowerCase().includes(searchProduct.toLowerCase())
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={16} /> },
    { id: 'orders', label: 'Commandes', icon: <ShoppingBag size={16} /> },
    { id: 'products', label: 'Produits', icon: <Package size={16} /> },
    { id: 'customers', label: 'Clients', icon: <Users size={16} /> },
  ];

  return (
    <div className="bg-gray-950 min-h-screen">
      {/* Admin Header */}
      <div className="bg-gray-900 border-b border-white/5 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              ⚙️ Panneau d'Administration
            </h1>
            <p className="text-gray-400 text-sm">Bienvenue, {currentUser?.name}</p>
          </div>
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-white/10 rounded-xl text-gray-300 text-sm hover:text-white transition-all"
          >
            <Eye size={15} />
            Voir le site
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
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

        {/* ===== DASHBOARD ===== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {statsData.map((stat) => (
                <div key={stat.label} className="bg-gray-900 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                      {stat.icon}
                    </div>
                    <span className={`flex items-center gap-1 text-sm font-semibold ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                      {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-white font-black text-2xl mt-1">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Revenue chart (simulated) */}
              <div className="lg:col-span-2 bg-gray-900 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-bold text-lg">Revenus mensuels (DT)</h3>
                  <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                    <TrendingUp size={16} />
                    +18.2% vs mois dernier
                  </div>
                </div>
                <div className="flex items-end gap-3 h-40">
                  {[68, 82, 91, 75, 95, 88, 100, 78, 92, 85, 98, 110].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-indigo-500 transition-all hover:from-blue-500 hover:to-indigo-400"
                        style={{ height: `${h}%` }}
                      />
                      <span className="text-gray-500 text-[9px]">
                        {['J','F','M','A','M','J','J','A','S','O','N','D'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category breakdown */}
              <div className="bg-gray-900 border border-white/5 rounded-2xl p-6">
                <h3 className="text-white font-bold text-lg mb-6">Ventes par catégorie</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Laptops', pct: 35, color: 'bg-blue-500' },
                    { label: 'Desktops', pct: 28, color: 'bg-indigo-500' },
                    { label: 'Composants', pct: 18, color: 'bg-violet-500' },
                    { label: 'Périphériques', pct: 12, color: 'bg-purple-500' },
                    { label: 'Moniteurs', pct: 7, color: 'bg-pink-500' },
                  ].map((cat) => (
                    <div key={cat.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">{cat.label}</span>
                        <span className="text-gray-400">{cat.pct}%</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Low stock alerts */}
            <div className="bg-gray-900 border border-white/5 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <AlertTriangle size={18} className="text-orange-400" />
                Alertes stock faible
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {products.filter((p) => p.stock <= 5).map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">{p.name}</p>
                      <p className={`text-xs font-bold ${p.stock === 0 ? 'text-red-400' : 'text-orange-400'}`}>
                        {p.stock === 0 ? '⛔ Rupture' : `⚠️ ${p.stock} restant(s)`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== ORDERS TAB ===== */}
        {activeTab === 'orders' && (
          <div className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-white font-bold text-lg">Toutes les commandes</h2>
              <span className="text-gray-400 text-sm">{mockOrders.length} commandes</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Référence', 'Client', 'Ville', 'Articles', 'Total', 'Statut', 'Date', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-gray-400 text-xs font-semibold uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockOrders.map((order, idx) => {
                    const status = statusConfig[order.status as keyof typeof statusConfig];
                    return (
                      <tr key={order.id} className={`border-b border-white/5 hover:bg-white/2 transition-colors ${idx % 2 === 0 ? '' : 'bg-gray-800/20'}`}>
                        <td className="px-5 py-4">
                          <span className="text-blue-400 font-mono font-semibold text-sm">{order.id}</span>
                        </td>
                        <td className="px-5 py-4 text-white text-sm font-medium">{order.customer}</td>
                        <td className="px-5 py-4 text-gray-400 text-sm">{order.city}</td>
                        <td className="px-5 py-4 text-gray-300 text-sm">{order.items}</td>
                        <td className="px-5 py-4 text-white font-bold text-sm">{order.total.toLocaleString()} DT</td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-400 text-xs">{order.date}</td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <button className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all">
                              <Eye size={14} />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all">
                              <Edit2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== PRODUCTS TAB ===== */}
        {activeTab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3 bg-gray-900 border border-white/10 rounded-xl px-3 py-2 w-72">
                <Search size={15} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher produits..."
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  className="bg-transparent text-white text-sm outline-none w-full placeholder-gray-500"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all">
                <Plus size={15} />
                Ajouter un produit
              </button>
            </div>

            <div className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      {['Produit', 'Catégorie', 'Marque', 'Prix', 'Stock', 'Note', 'Actions'].map((h) => (
                        <th key={h} className="text-left px-5 py-3 text-gray-400 text-xs font-semibold uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product, idx) => (
                      <tr key={product.id} className={`border-b border-white/5 hover:bg-white/2 transition-colors ${idx % 2 === 0 ? '' : 'bg-gray-800/20'}`}>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <p className="text-white text-sm font-medium line-clamp-1 max-w-48">{product.name}</p>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="px-2 py-1 bg-gray-800 rounded-lg text-gray-300 text-xs capitalize">{product.category}</span>
                        </td>
                        <td className="px-5 py-3 text-gray-300 text-sm">{product.brand}</td>
                        <td className="px-5 py-3">
                          <div>
                            <p className="text-white font-bold text-sm">{product.price.toLocaleString()} DT</p>
                            {product.discount && <p className="text-green-400 text-xs">-{product.discount}%</p>}
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                            product.stock === 0 ? 'text-red-400 bg-red-400/10' :
                            product.stock <= 5 ? 'text-orange-400 bg-orange-400/10' :
                            'text-green-400 bg-green-400/10'
                          }`}>
                            {product.stock === 0 ? 'Rupture' : `${product.stock} unités`}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1">
                            <Star size={12} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-gray-300 text-sm">{product.rating}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex gap-1.5">
                            <button className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all">
                              <Edit2 size={13} />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===== CUSTOMERS TAB ===== */}
        {activeTab === 'customers' && (
          <div className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/5">
              <h2 className="text-white font-bold text-lg">Gestion des Clients</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Client', 'Email', 'Ville', 'Commandes', 'Total dépensé', 'Inscription'].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-gray-400 text-xs font-semibold uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Mehdi Trabelsi', email: 'mehdi@gmail.com', city: 'Tunis', orders: 5, spent: 18450, date: '2024-01-15' },
                    { name: 'Amira Ben Salah', email: 'amira@gmail.com', city: 'Sfax', orders: 3, spent: 8920, date: '2024-03-22' },
                    { name: 'Karim Maaloul', email: 'karim@gmail.com', city: 'Sousse', orders: 8, spent: 32100, date: '2023-11-08' },
                    { name: 'Sami Bouaziz', email: 'sami@gmail.com', city: 'Bizerte', orders: 2, spent: 4580, date: '2024-05-30' },
                    { name: 'Fatma Hammami', email: 'fatma@gmail.com', city: 'Monastir', orders: 6, spent: 15200, date: '2024-02-14' },
                  ].map((customer, idx) => (
                    <tr key={customer.email} className={`border-b border-white/5 hover:bg-white/2 transition-colors ${idx % 2 === 0 ? '' : 'bg-gray-800/20'}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {customer.name.charAt(0)}
                          </div>
                          <span className="text-white text-sm font-medium">{customer.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-sm">{customer.email}</td>
                      <td className="px-5 py-4 text-gray-300 text-sm">{customer.city}</td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold rounded-lg">
                          {customer.orders} cmd
                        </span>
                      </td>
                      <td className="px-5 py-4 text-white font-bold text-sm">{customer.spent.toLocaleString()} DT</td>
                      <td className="px-5 py-4 text-gray-400 text-xs">{customer.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
