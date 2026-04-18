import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Search, Heart, Menu, X, User, ChevronDown, Zap, Bell } from 'lucide-react';
import { useStore } from '../store/useStore';
import { categories } from '../data/products';
import { PageType } from '../types';

interface NavbarProps {
  onNavigate: (page: PageType) => void;
  currentPage: PageType;
}

export default function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const {
    getCartCount,
    wishlist,
    isAuthenticated,
    currentUser,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  } = useStore();

  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (showSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showSearch]);

  const navLinks = [
    { label: 'Accueil', page: 'home' },
    { label: 'Catalogue', page: 'catalog', hasDropdown: true },
    { label: 'Promotions', page: 'promotions' },
    { label: 'À propos', page: 'about' },
  ];

  return (
    <>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white text-xs py-2 px-4 text-center font-medium">
        <span className="flex items-center justify-center gap-2">
          <Zap size={12} className="text-yellow-300" />
          Livraison gratuite en Tunisie pour toute commande supérieure à 500 DT !
          <span className="text-yellow-300 font-bold ml-2">CODE: TECHNOVA2026</span>
          <Zap size={12} className="text-yellow-300" />
        </span>
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-gray-950/95 backdrop-blur-xl shadow-2xl shadow-black/20 border-b border-white/5'
            : 'bg-gray-950'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300">
                  <span className="text-white font-black text-lg leading-none">T</span>
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-gray-950 animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <span className="text-white font-black text-xl tracking-tight font-display">
                  Tec<span className="text-blue-400">nova</span>
                </span>
                <div className="text-gray-500 text-[9px] font-medium tracking-widest uppercase leading-none">
                  Tech Store Tunisia
                </div>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div key={link.page} className="relative">
                  {link.hasDropdown ? (
                    <div
                      className="relative"
                      onMouseEnter={() => setShowCategories(true)}
                      onMouseLeave={() => setShowCategories(false)}
                    >
                      <button
                        className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentPage === link.page
                            ? 'text-blue-400 bg-blue-500/10'
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                        onClick={() => onNavigate(link.page)}
                      >
                        {link.label}
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${showCategories ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {/* Mega dropdown */}
                      {showCategories && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
                          <div className="p-2">
                            {categories.slice(1).map((cat) => (
                              <button
                                key={cat.id}
                                onClick={() => {
                                  onNavigate('catalog');
                                  useStore.getState().setSelectedCategory(cat.id);
                                  setShowCategories(false);
                                }}
                                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-all group"
                              >
                                <span className="flex items-center gap-3">
                                  <span className="text-lg">{cat.icon}</span>
                                  <span className="text-sm font-medium">{cat.label}</span>
                                </span>
                                <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-all">
                                  {cat.count}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => onNavigate(link.page)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentPage === link.page
                          ? 'text-blue-400 bg-blue-500/10'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {link.label}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                {showSearch ? (
                  <div className="flex items-center gap-2 bg-gray-800 border border-white/10 rounded-xl px-3 py-1.5 w-56 transition-all">
                    <Search size={15} className="text-gray-400 shrink-0" />
                    <input
                      ref={searchRef}
                      type="text"
                      placeholder="Rechercher..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          onNavigate('catalog');
                          setShowSearch(false);
                        }
                        if (e.key === 'Escape') setShowSearch(false);
                      }}
                      className="bg-transparent text-white text-sm outline-none w-full placeholder-gray-500"
                    />
                    <button onClick={() => setShowSearch(false)}>
                      <X size={14} className="text-gray-400 hover:text-white" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSearch(true)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                  >
                    <Search size={19} />
                  </button>
                )}
              </div>

              {/* Wishlist */}
              <button
                onClick={() => isAuthenticated ? onNavigate('wishlist') : onNavigate('login')}
                className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                <Heart size={19} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-pink-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all hidden sm:flex">
                <Bell size={19} />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full"></span>
              </button>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                <ShoppingCart size={19} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              {/* User */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/20 hover:border-blue-500/40 transition-all"
                  >
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                      {currentUser?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white text-sm font-medium hidden sm:block">
                      {currentUser?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown size={13} className="text-gray-400 hidden sm:block" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-52 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                      <div className="p-3 border-b border-white/10">
                        <p className="text-white text-sm font-semibold">{currentUser?.name}</p>
                        <p className="text-gray-400 text-xs">{currentUser?.email}</p>
                      </div>
                      <div className="p-1.5">
                        {[
                          { label: '👤 Mon Profil', page: 'profile' },
                          { label: '📦 Mes Commandes', page: 'orders' },
                          { label: '❤️ Mes Favoris', page: 'wishlist' },
                          ...(currentUser?.role === 'admin' ? [{ label: '⚙️ Administration', page: 'admin' }] : []),
                        ].map((item) => (
                          <button
                            key={item.page}
                            onClick={() => { onNavigate(item.page); setShowUserMenu(false); }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                          >
                            {item.label}
                          </button>
                        ))}
                        <div className="my-1 border-t border-white/10"></div>
                        <button
                          onClick={() => {
                            useStore.getState().logout();
                            setShowUserMenu(false);
                            onNavigate('home');
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          🚪 Déconnexion
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => onNavigate('login')}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                >
                  <User size={15} />
                  Connexion
                </button>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-gray-950 border-t border-white/5">
            <div className="px-4 py-4 space-y-2">
              {/* Search Mobile */}
              <div className="flex items-center gap-2 bg-gray-800 border border-white/10 rounded-xl px-3 py-2.5">
                <Search size={15} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher des produits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onNavigate('catalog');
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className="bg-transparent text-white text-sm outline-none w-full placeholder-gray-500"
                />
              </div>

              {navLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => { onNavigate(link.page); setIsMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    currentPage === link.page
                      ? 'text-blue-400 bg-blue-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              ))}

              <div className="pt-2 border-t border-white/10">
                {isAuthenticated ? (
                  <div className="space-y-1">
                    <button onClick={() => { onNavigate('profile'); setIsMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                      👤 Mon Profil
                    </button>
                    <button onClick={() => { onNavigate('orders'); setIsMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                      📦 Mes Commandes
                    </button>
                    <button onClick={() => { useStore.getState().logout(); setIsMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                      🚪 Déconnexion
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { onNavigate('login'); setIsMobileMenuOpen(false); }}
                    className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold"
                  >
                    Connexion / Inscription
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
