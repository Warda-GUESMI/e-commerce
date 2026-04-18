import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ChevronDown, X, Grid3X3, List, Star } from 'lucide-react';
import { products, categories, brands } from '../data/products';
import { useStore, Product } from '../store/useStore';
import { PageType } from '../types';
import ProductCard from '../components/ProductCard';

interface CatalogPageProps {
  onNavigate: (page: PageType) => void;
  onViewProduct: (product: Product) => void;
}

const sortOptions = [
  { value: 'featured', label: 'Mis en avant' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'rating', label: 'Meilleures notes' },
  { value: 'newest', label: 'Nouveautés' },
  { value: 'discount', label: 'Meilleures remises' },
];

export default function CatalogPage({ onNavigate, onViewProduct }: CatalogPageProps) {
  const { selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useStore();
  const [sort, setSort] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [inStockOnly, setInStockOnly] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((t) => t.includes(query))
      );
    }

    // Price range
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) => selectedBrands.includes(p.brand));
    }

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter((p) => p.rating >= minRating);
    }

    // Stock filter
    if (inStockOnly) {
      filtered = filtered.filter((p) => p.stock > 0);
    }

    // Sort
    switch (sort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'discount':
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return filtered;
  }, [selectedCategory, searchQuery, priceRange, selectedBrands, minRating, inStockOnly, sort]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setPriceRange([0, 10000]);
    setSelectedBrands([]);
    setMinRating(0);
    setInStockOnly(false);
    setSort('featured');
  };

  const hasFilters =
    selectedCategory !== 'all' ||
    searchQuery ||
    priceRange[0] > 0 ||
    priceRange[1] < 10000 ||
    selectedBrands.length > 0 ||
    minRating > 0 ||
    inStockOnly;

  return (
    <div className="bg-gray-950 min-h-screen">
      {/* Page Header */}
      <div className="bg-gray-900 border-b border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-white">
                {selectedCategory === 'all'
                  ? 'Tous les Produits'
                  : categories.find((c) => c.id === selectedCategory)?.label || 'Catalogue'}
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 border border-white/5'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span className="hidden sm:inline">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* ===== SIDEBAR FILTERS ===== */}
          <aside className={`w-72 shrink-0 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            {/* Filter Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-blue-400" />
                Filtres
              </h2>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-blue-400 hover:text-blue-300 text-xs font-semibold flex items-center gap-1"
                >
                  <X size={12} />
                  Réinitialiser
                </button>
              )}
            </div>

            {/* Search */}
            <div className="bg-gray-900 border border-white/5 rounded-2xl p-4">
              <h3 className="text-white font-semibold text-sm mb-3">Recherche</h3>
              <div className="flex items-center gap-2 bg-gray-800 border border-white/10 rounded-xl px-3 py-2">
                <Search size={14} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Nom, marque..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-white text-sm outline-none w-full placeholder-gray-500"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')}>
                    <X size={12} className="text-gray-400 hover:text-white" />
                  </button>
                )}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-gray-900 border border-white/5 rounded-2xl p-4">
              <h3 className="text-white font-semibold text-sm mb-3">Prix (DT)</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-xs mb-2 block">
                    Maximum: <span className="text-blue-400 font-semibold">{priceRange[1].toLocaleString()} DT</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={10000}
                    step={100}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="w-full bg-gray-800 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs outline-none"
                  />
                  <span className="text-gray-500 self-center">—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000])}
                    className="w-full bg-gray-800 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Brands */}
            <div className="bg-gray-900 border border-white/5 rounded-2xl p-4">
              <h3 className="text-white font-semibold text-sm mb-3">Marques</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                {brands.map((brand) => (
                  <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
                    <div
                      onClick={() => toggleBrand(brand)}
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                        selectedBrands.includes(brand)
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-600 group-hover:border-blue-500'
                      }`}
                    >
                      {selectedBrands.includes(brand) && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span
                      onClick={() => toggleBrand(brand)}
                      className={`text-sm transition-colors ${
                        selectedBrands.includes(brand) ? 'text-blue-400 font-medium' : 'text-gray-400 group-hover:text-white'
                      }`}
                    >
                      {brand}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div className="bg-gray-900 border border-white/5 rounded-2xl p-4">
              <h3 className="text-white font-semibold text-sm mb-3">Note minimale</h3>
              <div className="space-y-2">
                {[4.5, 4, 3.5, 0].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
                      minRating === rating
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {rating > 0 ? (
                      <>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={12} className={s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} />
                          ))}
                        </div>
                        <span>{rating}+</span>
                      </>
                    ) : (
                      <span>Toutes les notes</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock */}
            <div className="bg-gray-900 border border-white/5 rounded-2xl p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setInStockOnly(!inStockOnly)}
                  className={`w-10 h-5 rounded-full transition-all ${inStockOnly ? 'bg-blue-600' : 'bg-gray-700'} relative`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${inStockOnly ? 'left-5' : 'left-0.5'}`} />
                </div>
                <span className="text-gray-300 text-sm font-medium">En stock uniquement</span>
              </label>
            </div>
          </aside>

          {/* ===== PRODUCT GRID ===== */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-800 border border-white/10 rounded-xl text-gray-300 text-sm font-medium hover:text-white transition-all"
              >
                <SlidersHorizontal size={15} />
                Filtres {hasFilters && <span className="text-blue-400">•</span>}
              </button>

              <div className="flex-1" />

              {/* View mode */}
              <div className="flex gap-1 bg-gray-900 border border-white/10 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <Grid3X3 size={15} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <List size={15} />
                </button>
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none bg-gray-900 border border-white/10 rounded-xl px-4 py-2 pr-8 text-gray-300 text-sm outline-none cursor-pointer hover:border-blue-500/30 transition-all"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-gray-900">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Active filters display */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-5">
                {selectedCategory !== 'all' && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 text-xs font-medium">
                    {categories.find((c) => c.id === selectedCategory)?.label}
                    <button onClick={() => setSelectedCategory('all')}><X size={11} /></button>
                  </span>
                )}
                {searchQuery && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 text-xs font-medium">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery('')}><X size={11} /></button>
                  </span>
                )}
                {selectedBrands.map((brand) => (
                  <span key={brand} className="flex items-center gap-1.5 px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 text-xs font-medium">
                    {brand}
                    <button onClick={() => toggleBrand(brand)}><X size={11} /></button>
                  </span>
                ))}
                {inStockOnly && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-green-600/20 border border-green-500/30 rounded-full text-green-400 text-xs font-medium">
                    En stock
                    <button onClick={() => setInStockOnly(false)}><X size={11} /></button>
                  </span>
                )}
              </div>
            )}

            {/* Products */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-24">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-white font-bold text-xl mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-400 mb-6">Essayez de modifier vos filtres ou votre recherche.</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                  : 'space-y-4'
              }>
                {filteredProducts.map((product) =>
                  viewMode === 'grid' ? (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onNavigate={onNavigate}
                      onViewProduct={onViewProduct}
                    />
                  ) : (
                    /* List view */
                    <div
                      key={product.id}
                      onClick={() => onViewProduct(product)}
                      className="flex gap-4 bg-gray-900 border border-white/5 rounded-2xl p-4 hover:border-blue-500/30 transition-all cursor-pointer group"
                    >
                      <div className="w-28 h-28 rounded-xl overflow-hidden bg-gray-800 shrink-0">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-blue-400 text-xs font-semibold uppercase mb-1">{product.brand}</p>
                        <h3 className="text-white font-bold mb-1 line-clamp-1">{product.name}</h3>
                        <p className="text-gray-400 text-sm line-clamp-2 mb-2">{product.description}</p>
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(s => <Star key={s} size={11} className={s <= product.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} />)}
                          <span className="text-gray-400 text-xs ml-1">({product.reviews})</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between shrink-0">
                        <div className="text-right">
                          <div className="text-white font-black text-xl">{product.price.toLocaleString()} <span className="text-blue-400 text-sm">DT</span></div>
                          {product.originalPrice && <div className="text-gray-500 text-sm line-through">{product.originalPrice.toLocaleString()} DT</div>}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); useStore.getState().addToCart(product); }}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all"
                        >
                          + Panier
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
