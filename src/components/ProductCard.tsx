import { useState } from 'react';
import { ShoppingCart, Heart, Star, Eye, Zap, Package } from 'lucide-react';
import { useStore, Product } from '../store/useStore';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  onNavigate?: (page: string) => void;
  onViewProduct: (product: Product) => void;
}

export default function ProductCard({ product, onViewProduct }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageError, setImageError] = useState(false);

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock === 0) return;
    setIsAddingToCart(true);
    addToCart(product);
    toast.success(`${product.name.slice(0, 25)}... ajouté au panier !`, {
      icon: '🛒',
      style: {
        background: '#1e293b',
        color: '#f1f5f9',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
      },
    });
    setTimeout(() => setIsAddingToCart(false), 800);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
    toast.success(inWishlist ? 'Retiré des favoris' : 'Ajouté aux favoris !', {
      icon: inWishlist ? '💔' : '❤️',
      style: {
        background: '#1e293b',
        color: '#f1f5f9',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
      },
    });
  };

  const stockStatus = () => {
    if (product.stock === 0) return { label: 'Rupture de stock', color: 'text-red-400 bg-red-400/10' };
    if (product.stock <= 5) return { label: `Plus que ${product.stock} !`, color: 'text-orange-400 bg-orange-400/10' };
    return { label: 'En stock', color: 'text-green-400 bg-green-400/10' };
  };

  const stock = stockStatus();

  return (
    <div
      className="group relative bg-gray-900 border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer"
      onClick={() => onViewProduct(product)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.badge && (
          <span className="px-2.5 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-lg shadow-lg">
            {product.badge}
          </span>
        )}
        {product.isNew && !product.badge && (
          <span className="px-2.5 py-1 bg-green-500 text-white text-xs font-bold rounded-lg">
            NEW
          </span>
        )}
        {product.discount && (
          <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Wishlist button */}
      <button
        onClick={handleWishlist}
        className={`absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200 ${
          inWishlist
            ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
            : 'bg-gray-800/80 text-gray-400 hover:text-pink-400 hover:bg-pink-500/20 border border-white/5 opacity-0 group-hover:opacity-100'
        }`}
      >
        <Heart size={14} fill={inWishlist ? 'currentColor' : 'none'} />
      </button>

      {/* Product Image */}
      <div className="relative overflow-hidden bg-gray-800 aspect-square">
        {!imageError ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <Package size={40} className="text-gray-600" />
          </div>
        )}

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onViewProduct(product); }}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold rounded-xl hover:bg-white/20 transition-all"
          >
            <Eye size={15} />
            Voir détails
          </button>
        </div>

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="px-4 py-2 bg-gray-900/90 text-gray-300 text-sm font-semibold rounded-xl">
              Rupture de stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
          {product.brand}
        </p>

        {/* Name */}
        <h3 className="text-white font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-blue-100 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={11}
                className={star <= Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-600'}
                fill={star <= Math.floor(product.rating) ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <span className="text-yellow-400 text-xs font-semibold">{product.rating}</span>
          <span className="text-gray-500 text-xs">({product.reviews})</span>
        </div>

        {/* Stock */}
        <div className="mb-3">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-md flex items-center gap-1 w-fit ${stock.color}`}>
            <Package size={9} />
            {stock.label}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-black text-lg">
                {product.price.toLocaleString()}
                <span className="text-blue-400 text-sm font-bold ml-1">DT</span>
              </span>
            </div>
            {product.originalPrice && (
              <span className="text-gray-500 text-xs line-through">
                {product.originalPrice.toLocaleString()} DT
              </span>
            )}
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
              isAddingToCart
                ? 'bg-green-500 text-white scale-95'
                : product.stock === 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40'
            }`}
          >
            {isAddingToCart ? (
              <>✓</>
            ) : (
              <>
                {product.stock <= 3 && product.stock > 0 ? (
                  <Zap size={13} className="text-yellow-300" />
                ) : (
                  <ShoppingCart size={13} />
                )}
                Ajouter
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
