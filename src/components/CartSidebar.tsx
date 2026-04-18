import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package } from 'lucide-react';
import { useStore } from '../store/useStore';

interface CartSidebarProps {
  onNavigate: (page: string) => void;
}

export default function CartSidebar({ onNavigate }: CartSidebarProps) {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCart,
  } = useStore();

  const total = getCartTotal();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-950 border-l border-white/10 z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-gray-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <ShoppingCart size={18} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Mon Panier</h2>
              <p className="text-gray-400 text-xs">{cart.length} article{cart.length > 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-gray-800 flex items-center justify-center mb-4">
                <Package size={32} className="text-gray-600" />
              </div>
              <h3 className="text-gray-300 font-semibold text-lg mb-2">Panier vide</h3>
              <p className="text-gray-500 text-sm mb-6">Ajoutez des produits pour commencer vos achats</p>
              <button
                onClick={() => { setIsCartOpen(false); onNavigate('catalog'); }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all"
              >
                Explorer le catalogue
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 p-3 bg-gray-900/60 border border-white/5 rounded-2xl hover:border-white/10 transition-all"
              >
                {/* Product image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-800 shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-semibold leading-tight mb-1 truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-gray-400 text-xs mb-2">{item.product.brand}</p>

                  <div className="flex items-center justify-between">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-1.5 bg-gray-800 rounded-lg p-0.5">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-all"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-white text-sm font-semibold w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-all disabled:opacity-30"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Price */}
                    <span className="text-blue-400 font-bold text-sm">
                      {(item.product.price * item.quantity).toLocaleString()} DT
                    </span>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all self-start"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-4 py-4 border-t border-white/10 bg-gray-900/50 space-y-3">
            {/* Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Sous-total</span>
                <span className="text-gray-300">{total.toLocaleString()} DT</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Livraison</span>
                <span className="text-green-400 font-medium">
                  {total >= 500 ? 'Gratuite 🎉' : '15 DT'}
                </span>
              </div>
              {total < 500 && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-3 py-2">
                  <p className="text-blue-300 text-xs">
                    Ajoutez encore <strong>{(500 - total).toLocaleString()} DT</strong> pour la livraison gratuite !
                  </p>
                </div>
              )}
              <div className="flex justify-between font-bold">
                <span className="text-white text-base">Total</span>
                <span className="text-blue-400 text-lg">
                  {(total + (total >= 500 ? 0 : 15)).toLocaleString()} DT
                </span>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={() => { setIsCartOpen(false); onNavigate('checkout'); }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 text-sm"
            >
              Commander maintenant
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => { setIsCartOpen(false); onNavigate('catalog'); }}
              className="w-full py-2.5 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
            >
              Continuer les achats
            </button>
            <button
              onClick={clearCart}
              className="w-full py-2 text-gray-500 hover:text-red-400 text-xs transition-all"
            >
              Vider le panier
            </button>
          </div>
        )}
      </div>
    </>
  );
}
