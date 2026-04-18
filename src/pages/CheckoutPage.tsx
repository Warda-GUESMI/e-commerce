import { useState } from 'react';
import {
  CreditCard, Truck, Check, ArrowLeft, MapPin,
  Phone, User, Shield, Package, ChevronRight
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { PageType } from '../types';
import toast from 'react-hot-toast';

interface CheckoutPageProps {
  onNavigate: (page: PageType) => void;
}

const WILAYAS = [
  'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan', 'Bizerte',
  'Béja', 'Jendouba', 'Le Kef', 'Siliana', 'Sousse', 'Monastir', 'Mahdia',
  'Sfax', 'Kairouan', 'Kasserine', 'Sidi Bouzid', 'Gabès', 'Médenine',
  'Tataouine', 'Gafsa', 'Tozeur', 'Kébili',
];

const paymentMethods = [
  { id: 'cod', label: 'Paiement à la livraison', icon: '💵', desc: 'Payez en espèces à la réception de votre commande.' },
  { id: 'card', label: 'Carte bancaire', icon: '💳', desc: 'Visa, Mastercard, CIB. Paiement sécurisé 3D Secure.' },
  { id: 'd17', label: 'D17 / Poste', icon: '📱', desc: 'Paiement via l\'application D17 ou bureau de poste.' },
];

export default function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { cart, getCartTotal, clearCart, addOrder, currentUser } = useStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    address: '',
    city: currentUser?.city || 'Tunis',
    notes: '',
    payment: 'cod',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVV: '',
  });

  const total = getCartTotal();
  const shipping = total >= 500 ? 0 : 15;
  const finalTotal = total + shipping;

  const handleInput = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));

    const id = `TN-${Date.now().toString(36).toUpperCase()}`;
    setOrderId(id);

    addOrder({
      id,
      userId: currentUser?.id || 'guest',
      items: cart,
      total: finalTotal,
      status: 'confirmed',
      date: new Date().toISOString(),
      shippingAddress: `${form.address}, ${form.city}`,
      paymentMethod: form.payment,
    });

    clearCart();
    setStep(3);
    setLoading(false);

    toast.success('Commande confirmée ! Vous recevrez un SMS de confirmation.', {
      style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' },
    });
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="bg-gray-950 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-white font-bold text-xl mb-2">Votre panier est vide</h2>
          <p className="text-gray-400 mb-6">Ajoutez des produits avant de passer commande.</p>
          <button onClick={() => onNavigate('catalog')} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all">
            Explorer le catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          {step < 3 && (
            <button onClick={() => step > 1 ? setStep(step - 1) : onNavigate('catalog')} className="p-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-black text-white">
              {step === 3 ? '🎉 Commande Confirmée !' : 'Finaliser la commande'}
            </h1>
            {step < 3 && (
              <p className="text-gray-400 text-sm mt-1">Étape {step} sur 2</p>
            )}
          </div>
        </div>

        {/* Progress */}
        {step < 3 && (
          <div className="flex items-center gap-3 mb-10">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-3 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step > s ? 'bg-green-500 text-white' : step === s ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-500'
                }`}>
                  {step > s ? <Check size={15} /> : s}
                </div>
                <span className={`text-sm font-medium ${step >= s ? 'text-white' : 'text-gray-500'}`}>
                  {s === 1 ? 'Livraison' : 'Paiement'}
                </span>
                {s < 2 && <div className={`flex-1 h-px ${step > s ? 'bg-green-500' : 'bg-gray-700'}`} />}
              </div>
            ))}
          </div>
        )}

        {/* ===== ORDER SUCCESS ===== */}
        {step === 3 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-8 animate-bounce">
              <Check size={40} className="text-green-400" />
            </div>
            <h2 className="text-3xl font-black text-white mb-3">Merci pour votre commande !</h2>
            <p className="text-gray-400 text-lg mb-2">Votre commande a été passée avec succès.</p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/20 border border-blue-500/30 rounded-2xl text-blue-400 font-bold text-lg mb-8">
              <Package size={20} />
              Référence: {orderId}
            </div>
            <div className="bg-gray-900 border border-white/5 rounded-3xl p-8 max-w-md mx-auto mb-8">
              <div className="space-y-4">
                {[
                  { icon: '📱', text: 'SMS de confirmation envoyé sur votre téléphone' },
                  { icon: '📦', text: 'Préparation de votre colis dans les 12 heures' },
                  { icon: '🚚', text: 'Livraison estimée en 24-48 heures' },
                  { icon: '✅', text: 'Garantie constructeur incluse' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3 text-left">
                    <span className="text-xl shrink-0">{item.icon}</span>
                    <p className="text-gray-300 text-sm">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('orders')}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:from-blue-500 hover:to-indigo-500 transition-all"
              >
                Suivre ma commande <ChevronRight size={18} />
              </button>
              <button onClick={() => onNavigate('home')} className="px-8 py-4 border border-white/10 text-gray-300 font-bold rounded-2xl hover:bg-white/5 transition-all">
                Retour à l'accueil
              </button>
            </div>
          </div>
        )}

        {step < 3 && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* ===== MAIN FORM ===== */}
            <div className="lg:col-span-2">
              {/* STEP 1 — SHIPPING */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="bg-gray-900 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                      <MapPin size={18} className="text-blue-400" />
                      Informations de livraison
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-1.5">Nom complet *</label>
                        <div className="relative">
                          <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={form.name}
                            onChange={(e) => handleInput('name', e.target.value)}
                            placeholder="Votre nom complet"
                            className="w-full bg-gray-800 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-all text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-1.5">Téléphone *</label>
                        <div className="relative">
                          <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="tel"
                            value={form.phone}
                            onChange={(e) => handleInput('phone', e.target.value)}
                            placeholder="+216 XX XXX XXX"
                            className="w-full bg-gray-800 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-all text-sm"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-gray-400 text-sm mb-1.5">Adresse complète *</label>
                        <input
                          type="text"
                          value={form.address}
                          onChange={(e) => handleInput('address', e.target.value)}
                          placeholder="Rue, numéro, immeuble, étage..."
                          className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-1.5">Gouvernorat *</label>
                        <select
                          value={form.city}
                          onChange={(e) => handleInput('city', e.target.value)}
                          className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all text-sm"
                        >
                          {WILAYAS.map((w) => (
                            <option key={w} value={w} className="bg-gray-800">{w}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-1.5">Email</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => handleInput('email', e.target.value)}
                          placeholder="votre@email.com"
                          className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-all text-sm"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-gray-400 text-sm mb-1.5">Notes (optionnel)</label>
                        <textarea
                          value={form.notes}
                          onChange={(e) => handleInput('notes', e.target.value)}
                          placeholder="Instructions spéciales pour la livraison..."
                          rows={3}
                          className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-all text-sm resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!form.name || !form.phone || !form.address}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg hover:from-blue-500 hover:to-indigo-500 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continuer vers le paiement →
                  </button>
                </div>
              )}

              {/* STEP 2 — PAYMENT */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="bg-gray-900 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                      <CreditCard size={18} className="text-blue-400" />
                      Mode de paiement
                    </h2>
                    <div className="space-y-3">
                      {paymentMethods.map((pm) => (
                        <label
                          key={pm.id}
                          className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                            form.payment === pm.id
                              ? 'border-blue-500/50 bg-blue-500/10'
                              : 'border-white/10 bg-gray-800/50 hover:border-white/20'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={pm.id}
                            checked={form.payment === pm.id}
                            onChange={(e) => handleInput('payment', e.target.value)}
                            className="accent-blue-500"
                          />
                          <span className="text-2xl">{pm.icon}</span>
                          <div>
                            <p className="text-white font-semibold text-sm">{pm.label}</p>
                            <p className="text-gray-400 text-xs">{pm.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>

                    {/* Card fields */}
                    {form.payment === 'card' && (
                      <div className="mt-5 p-4 bg-gray-800/50 rounded-2xl border border-white/10 space-y-4">
                        <div>
                          <label className="block text-gray-400 text-sm mb-1.5">Numéro de carte</label>
                          <input
                            type="text"
                            value={form.cardNumber}
                            onChange={(e) => handleInput('cardNumber', e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim())}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-all text-sm font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-sm mb-1.5">Nom sur la carte</label>
                          <input
                            type="text"
                            value={form.cardName}
                            onChange={(e) => handleInput('cardName', e.target.value.toUpperCase())}
                            placeholder="VOTRE NOM"
                            className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-all text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-400 text-sm mb-1.5">Expiration</label>
                            <input
                              type="text"
                              value={form.cardExpiry}
                              onChange={(e) => handleInput('cardExpiry', e.target.value.replace(/\D/g, '').slice(0, 4).replace(/(.{2})/, '$1/'))}
                              placeholder="MM/AA"
                              maxLength={5}
                              className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-all text-sm font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-sm mb-1.5">CVV</label>
                            <input
                              type="password"
                              value={form.cardCVV}
                              onChange={(e) => handleInput('cardCVV', e.target.value.slice(0, 3))}
                              placeholder="•••"
                              maxLength={3}
                              className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-all text-sm"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                          <Shield size={12} className="text-green-400" />
                          Paiement sécurisé SSL 256-bit
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg hover:from-green-500 hover:to-emerald-500 transition-all shadow-xl shadow-green-500/25"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Check size={20} />
                        Confirmer la commande • {finalTotal.toLocaleString()} DT
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* ===== ORDER SUMMARY ===== */}
            <div className="space-y-4">
              <div className="bg-gray-900 border border-white/5 rounded-2xl p-5 sticky top-24">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Package size={16} className="text-blue-400" />
                  Récapitulatif
                </h3>

                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto custom-scrollbar">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium leading-tight line-clamp-2">{item.product.name}</p>
                        <p className="text-gray-400 text-xs">x{item.quantity}</p>
                      </div>
                      <p className="text-blue-400 text-sm font-bold shrink-0">
                        {(item.product.price * item.quantity).toLocaleString()} DT
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Sous-total</span>
                    <span className="text-gray-300">{total.toLocaleString()} DT</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Livraison</span>
                    <span className={shipping === 0 ? 'text-green-400 font-semibold' : 'text-gray-300'}>
                      {shipping === 0 ? 'Gratuite 🎉' : `${shipping} DT`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-white/10">
                    <span className="text-white">Total TTC</span>
                    <span className="text-blue-400 text-lg">{finalTotal.toLocaleString()} DT</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <div className="flex items-center gap-2 text-green-400 text-xs">
                    <Truck size={13} />
                    <span>Livraison estimée: <strong>24-48h</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
