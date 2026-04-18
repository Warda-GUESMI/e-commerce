import { useState } from 'react';
import {
  Star, ShoppingCart, Heart, ArrowLeft, Package, Shield,
  Truck, Check, Minus, Plus, Share2, ChevronRight, Zap
} from 'lucide-react';
import { useStore, Product } from '../store/useStore';
import { products } from '../data/products';
import { PageType } from '../types';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

interface ProductDetailProps {
  product: Product;
  onNavigate: (page: PageType) => void;
  onViewProduct: (product: Product) => void;
}

export default function ProductDetailPage({ product, onNavigate, onViewProduct }: ProductDetailProps) {
  const { addToCart, toggleWishlist, isInWishlist, setIsCartOpen } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const inWishlist = isInWishlist(product.id);

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity}x ${product.name.slice(0, 20)}... ajouté au panier !`, {
      icon: '🛒',
      style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' },
    });
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onNavigate('checkout');
  };

  const stockStatus = () => {
    if (product.stock === 0) return { label: 'Rupture de stock', color: 'text-red-400', dot: 'bg-red-400' };
    if (product.stock <= 5) return { label: `Seulement ${product.stock} en stock`, color: 'text-orange-400', dot: 'bg-orange-400' };
    return { label: 'En stock', color: 'text-green-400', dot: 'bg-green-400' };
  };
  const stock = stockStatus();

  const savings = product.originalPrice ? product.originalPrice - product.price : 0;

  return (
    <div className="bg-gray-950 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-900/50 border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm">
            <button onClick={() => onNavigate('home')} className="text-gray-400 hover:text-white transition-colors">Accueil</button>
            <ChevronRight size={14} className="text-gray-600" />
            <button onClick={() => onNavigate('catalog')} className="text-gray-400 hover:text-white transition-colors">Catalogue</button>
            <ChevronRight size={14} className="text-gray-600" />
            <span className="text-blue-400 font-medium truncate max-w-xs">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back button */}
        <button
          onClick={() => onNavigate('catalog')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Retour au catalogue
        </button>

        {/* Product Main */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-900 rounded-3xl overflow-hidden border border-white/5">
              {product.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg">
                    {product.badge}
                  </span>
                </div>
              )}
              {product.discount && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-xl">
                    -{product.discount}%
                  </span>
                </div>
              )}
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%231f2937" width="100" height="100"/><text y=".9em" font-size="50" x="25">📦</text></svg>';
                }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand + badges */}
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm font-semibold rounded-lg">
                {product.brand}
              </span>
              {product.isNew && (
                <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-semibold rounded-lg">
                  NEW
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="text-3xl font-black text-white leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={18} className={s <= Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} />
                ))}
              </div>
              <span className="text-yellow-400 font-bold">{product.rating}</span>
              <span className="text-gray-400 text-sm">({product.reviews} avis)</span>
            </div>

            {/* Price */}
            <div className="bg-gray-900 border border-white/5 rounded-2xl p-5">
              <div className="flex items-end gap-4 mb-2">
                <span className="text-4xl font-black text-white">
                  {product.price.toLocaleString()}
                  <span className="text-blue-400 text-2xl ml-1">DT</span>
                </span>
                {product.originalPrice && (
                  <span className="text-gray-500 text-xl line-through mb-1">
                    {product.originalPrice.toLocaleString()} DT
                  </span>
                )}
              </div>
              {savings > 0 && (
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-green-400" />
                  <span className="text-green-400 text-sm font-semibold">
                    Vous économisez {savings.toLocaleString()} DT !
                  </span>
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${stock.dot} animate-pulse`}></div>
              <span className={`text-sm font-semibold ${stock.color}`}>{stock.label}</span>
            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm font-medium">Quantité:</span>
                <div className="flex items-center gap-2 bg-gray-900 border border-white/10 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-white font-bold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="text-gray-500 text-xs">(max: {product.stock})</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg hover:from-blue-500 hover:to-indigo-500 transition-all shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={20} />
                Ajouter au panier
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-14 h-14 flex items-center justify-center rounded-2xl border transition-all ${
                  inWishlist
                    ? 'bg-pink-500/20 border-pink-500/30 text-pink-400'
                    : 'bg-gray-900 border-white/10 text-gray-400 hover:text-pink-400 hover:border-pink-500/30'
                }`}
              >
                <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
              </button>
              <button className="w-14 h-14 flex items-center justify-center rounded-2xl border border-white/10 bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                <Share2 size={18} />
              </button>
            </div>

            {/* Buy Now */}
            {product.stock > 0 && (
              <button
                onClick={handleBuyNow}
                className="w-full py-4 rounded-2xl border-2 border-blue-500/30 text-blue-400 font-bold text-lg hover:bg-blue-500/10 transition-all"
              >
                Acheter maintenant →
              </button>
            )}

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Shield size={16} />, label: 'Garantie', sub: '1-3 ans' },
                { icon: <Truck size={16} />, label: 'Livraison', sub: '24-48h' },
                { icon: <Package size={16} />, label: 'Retour', sub: '30 jours' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-1 p-3 bg-gray-900 border border-white/5 rounded-xl text-center">
                  <div className="text-blue-400">{item.icon}</div>
                  <p className="text-white text-xs font-semibold">{item.label}</p>
                  <p className="text-gray-400 text-[10px]">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-10">
          <div className="flex gap-1 bg-gray-900 border border-white/5 rounded-2xl p-1 mb-8 w-fit">
            {['specs', 'description', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all capitalize ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'specs' ? 'Spécifications' : tab === 'description' ? 'Description' : 'Avis'}
              </button>
            ))}
          </div>

          {activeTab === 'specs' && (
            <div className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden">
              {Object.entries(product.specs).map(([key, value], idx) => (
                <div
                  key={key}
                  className={`flex items-center ${idx % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800/30'}`}
                >
                  <div className="w-1/3 px-6 py-4 text-gray-400 text-sm font-medium border-r border-white/5">
                    {key}
                  </div>
                  <div className="flex-1 px-6 py-4 text-white text-sm font-semibold">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'description' && (
            <div className="bg-gray-900 border border-white/5 rounded-2xl p-8">
              <p className="text-gray-300 leading-relaxed text-base mb-6">{product.description}</p>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium rounded-lg">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {/* Rating overview */}
              <div className="bg-gray-900 border border-white/5 rounded-2xl p-6 flex items-center gap-8">
                <div className="text-center">
                  <div className="text-5xl font-black text-white mb-1">{product.rating}</div>
                  <div className="flex justify-center gap-1 mb-1">
                    {[1,2,3,4,5].map(s => <Star key={s} size={14} className={s <= product.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} />)}
                  </div>
                  <p className="text-gray-400 text-sm">{product.reviews} avis</p>
                </div>
                <div className="flex-1 space-y-2">
                  {[5,4,3,2,1].map(s => (
                    <div key={s} className="flex items-center gap-3">
                      <span className="text-gray-400 text-xs w-4">{s}</span>
                      <Star size={11} className="text-yellow-400 fill-yellow-400" />
                      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 rounded-full"
                          style={{ width: s === 5 ? '75%' : s === 4 ? '20%' : s === 3 ? '3%' : '1%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Sample reviews */}
              {[
                { name: 'Sami B.', date: 'Il y a 3 jours', rating: 5, text: 'Excellent produit, conforme à la description. Livraison rapide et emballage soigné.' },
                { name: 'Fatma H.', date: 'Il y a 1 semaine', rating: 5, text: 'Très bon rapport qualité/prix. Je recommande Tecnova pour ses prix compétitifs et son service.' },
                { name: 'Omar K.', date: 'Il y a 2 semaines', rating: 4, text: 'Produit de qualité, livré en 24h. La performance est au rendez-vous.' },
              ].map((review, idx) => (
                <div key={idx} className="bg-gray-900 border border-white/5 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm flex items-center gap-2">
                          {review.name}
                          <Check size={12} className="text-blue-400" />
                          <span className="text-blue-400 text-xs">Achat vérifié</span>
                        </p>
                        <p className="text-gray-500 text-xs">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} />)}
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-black text-white mb-6">
              Produits <span className="text-blue-400">similaires</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onNavigate={onNavigate}
                  onViewProduct={onViewProduct}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
