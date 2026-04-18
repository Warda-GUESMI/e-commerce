import { useState, useEffect } from 'react';
import {
  ArrowRight, Shield, Truck, Headphones, CreditCard,
  Star, ChevronLeft, ChevronRight, Zap, TrendingUp, Award, Users
} from 'lucide-react';
import { products, categories, getFeaturedProducts } from '../data/products';
import { useStore, Product } from '../store/useStore';
import { PageType } from '../types';
import ProductCard from '../components/ProductCard';

interface HomePageProps {
  onNavigate: (page: PageType) => void;
  onViewProduct: (product: Product) => void;
}

const heroSlides = [
  {
    id: 1,
    badge: '🔥 Nouveauté 2026',
    title: 'PC Gaming',
    highlight: 'RTX 4090',
    subtitle: 'Performance ultime',
    description: 'Découvrez notre sélection de PC gaming haut de gamme assemblés par nos experts pour une expérience 4K sans compromis.',
    cta: 'Voir les Gaming PCs',
    ctaCategory: 'desktops',
    bg: 'from-blue-900/40 via-indigo-900/30 to-violet-900/40',
    accent: 'from-blue-500 to-indigo-600',
    image: '/images/gaming-pc.png',
  },
  {
    id: 2,
    badge: '⚡ Stock Limité',
    title: 'Laptops Gaming',
    highlight: 'RTX 4070',
    subtitle: 'Puissance nomade',
    description: 'Les meilleurs laptops gaming disponibles en Tunisie avec les dernières GPU NVIDIA et processeurs Intel i9.',
    cta: 'Explorer les Laptops',
    ctaCategory: 'laptops',
    bg: 'from-violet-900/40 via-purple-900/30 to-pink-900/40',
    accent: 'from-violet-500 to-purple-600',
    image: '/images/laptop-hero.png',
  },
  {
    id: 3,
    badge: '💎 Premium',
    title: 'Composants',
    highlight: 'Haut de Gamme',
    subtitle: 'Build your dream PC',
    description: 'GPU, CPU, RAM, SSD — tous les composants premium pour assembler votre configuration de rêve.',
    cta: 'Voir les Composants',
    ctaCategory: 'components',
    bg: 'from-cyan-900/40 via-blue-900/30 to-indigo-900/40',
    accent: 'from-cyan-500 to-blue-600',
    image: '/images/hero-bg.jpg',
  },
];

const stats = [
  { label: 'Produits', value: '500+', icon: '📦', color: 'text-blue-400' },
  { label: 'Clients Satisfaits', value: '15K+', icon: '😊', color: 'text-green-400' },
  { label: 'Marques', value: '50+', icon: '🏷️', color: 'text-violet-400' },
  { label: 'Années d\'exp.', value: '8+', icon: '🏆', color: 'text-yellow-400' },
];

const features = [
  {
    icon: <Truck size={24} />,
    title: 'Livraison Rapide',
    description: 'Livraison 24-48h partout en Tunisie. Gratuite dès 500 DT.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: <Shield size={24} />,
    title: 'Garantie Officielle',
    description: 'Tous nos produits sont garantis constructeur 1 à 3 ans.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: <Headphones size={24} />,
    title: 'Support Technique',
    description: 'Une équipe d\'experts disponibles 7j/7 pour vous accompagner.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: <CreditCard size={24} />,
    title: 'Paiement Sécurisé',
    description: 'Paiement en ligne ou à la livraison. Facilités disponibles.',
    color: 'from-orange-500 to-amber-500',
  },
];

const testimonials = [
  {
    name: 'Mehdi Trabelsi',
    role: 'Gamer / Streamer',
    city: 'Tunis',
    rating: 5,
    text: 'Tecnova m\'a livré mon PC gaming RTX 4080 en moins de 24h ! La qualité d\'assemblage est parfaite et le service client est au top. Je recommande à 100%.',
    avatar: 'M',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    name: 'Amira Ben Salah',
    rating: 5,
    role: 'Ingénieure Dev',
    city: 'Sfax',
    text: 'J\'ai acheté mon MacBook Pro ici. Prix compétitif, livraison rapide et garantie officielle Apple. La meilleure boutique tech en Tunisie !',
    avatar: 'A',
    color: 'from-violet-500 to-purple-600',
  },
  {
    name: 'Karim Maaloul',
    role: 'Designer 3D',
    city: 'Sousse',
    rating: 5,
    text: 'Ma station de travail Ryzen 9 + RTX 4090 tourne parfaitement. Tecnova propose des configurations sur mesure à des prix imbattables en Tunisie.',
    avatar: 'K',
    color: 'from-cyan-500 to-blue-600',
  },
];

export default function HomePage({ onNavigate, onViewProduct }: HomePageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoPlay]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const featured = getFeaturedProducts().slice(0, 8);
  const newProducts = products.filter((p) => p.isNew).slice(0, 4);
  const slide = heroSlides[currentSlide];

  return (
    <div className="bg-gray-950 min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${slide.bg} transition-all duration-1000`} />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('/images/hero-bg.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Glowing orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-semibold">
                <span>{slide.badge}</span>
              </div>

              {/* Title */}
              <div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight">
                  {slide.title}
                  <br />
                  <span className={`bg-gradient-to-r ${slide.accent} bg-clip-text text-transparent`}>
                    {slide.highlight}
                  </span>
                  <br />
                  <span className="text-gray-300 text-3xl sm:text-4xl font-bold">{slide.subtitle}</span>
                </h1>
              </div>

              <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                {slide.description}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    useStore.getState().setSelectedCategory(slide.ctaCategory);
                    onNavigate('catalog');
                  }}
                  className={`flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r ${slide.accent} text-white font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-xl`}
                >
                  {slide.cta}
                  <ArrowRight size={20} />
                </button>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-lg hover:bg-white/20 transition-all duration-300"
                >
                  Tout explorer
                </button>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-4 pt-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Product Image */}
            <div className="relative hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-3xl blur-3xl scale-110" />
                <img
                  src={slide.image}
                  alt="Hero product"
                  className="relative w-full h-auto rounded-3xl object-cover shadow-2xl border border-white/10"
                  style={{ maxHeight: '500px', objectFit: 'cover' }}
                />
                {/* Floating price badge */}
                <div className="absolute -bottom-4 -left-4 bg-gray-900 border border-white/10 rounded-2xl p-4 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${slide.accent} flex items-center justify-center`}>
                      <Zap size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">À partir de</p>
                      <p className="text-white font-black text-lg">2 299 DT</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6">
          <button
            onClick={() => goToSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === currentSlide ? 'w-8 h-2 bg-blue-400' : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => goToSlide((currentSlide + 1) % heroSlides.length)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* ===== FEATURES BAR ===== */}
      <section className="border-y border-white/5 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shrink-0 shadow-lg`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">{feature.title}</h3>
                  <p className="text-gray-500 text-xs leading-snug">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-white mb-2">
              Nos <span className="text-blue-400">Catégories</span>
            </h2>
            <p className="text-gray-400">Trouvez ce dont vous avez besoin</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(1).map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                useStore.getState().setSelectedCategory(cat.id);
                onNavigate('catalog');
              }}
              className="group flex flex-col items-center gap-3 p-5 bg-gray-900 border border-white/5 rounded-2xl hover:border-blue-500/30 hover:bg-gray-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                {cat.icon}
              </div>
              <div className="text-center">
                <p className="text-white text-sm font-semibold leading-tight">{cat.label}</p>
                <p className="text-gray-500 text-xs mt-0.5">{cat.count} produits</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-16 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-blue-400" />
                <span className="text-blue-400 text-sm font-semibold uppercase tracking-wider">Populaires</span>
              </div>
              <h2 className="text-3xl font-black text-white">
                Produits <span className="text-blue-400">Vedettes</span>
              </h2>
            </div>
            <button
              onClick={() => onNavigate('catalog')}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 text-sm font-medium transition-all"
            >
              Voir tout <ArrowRight size={15} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={onNavigate}
                onViewProduct={onViewProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROMO BANNER ===== */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-8 sm:p-12">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: `url('/images/promo-banner.jpg')`, backgroundSize: 'cover' }}
          />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 translate-y-1/2" />

          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full text-white text-xs font-bold mb-4">
                <Zap size={12} className="text-yellow-300" />
                OFFRE SPÉCIALE RAMADAN 2026
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
                Jusqu'à <span className="text-yellow-300">-25%</span> sur<br />
                les Gaming PCs
              </h2>
              <p className="text-blue-100 text-lg">
                Profitez de nos meilleures offres avant la fin du stock !
              </p>
            </div>
            <button
              onClick={() => {
                useStore.getState().setSelectedCategory('desktops');
                onNavigate('catalog');
              }}
              className="shrink-0 flex items-center gap-3 px-8 py-4 bg-white text-indigo-700 font-black text-lg rounded-2xl hover:bg-gray-100 transition-all shadow-2xl hover:scale-105"
            >
              Profiter de l'offre
              <ArrowRight size={22} />
            </button>
          </div>
        </div>
      </section>

      {/* ===== NEW PRODUCTS ===== */}
      {newProducts.length > 0 && (
        <section className="py-16 bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Award size={20} className="text-green-400" />
                  <span className="text-green-400 text-sm font-semibold uppercase tracking-wider">Nouveautés</span>
                </div>
                <h2 className="text-3xl font-black text-white">
                  Dernières <span className="text-green-400">Arrivées</span>
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onNavigate={onNavigate}
                  onViewProduct={onViewProduct}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Users size={20} className="text-yellow-400" />
            <span className="text-yellow-400 text-sm font-semibold uppercase tracking-wider">Avis Clients</span>
          </div>
          <h2 className="text-3xl font-black text-white">
            Ce que disent nos <span className="text-yellow-400">clients</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-900 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all"
            >
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={14} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-gray-500 text-xs">{testimonial.role} • {testimonial.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 border-t border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <span className="text-white font-black text-xl">T</span>
                </div>
                <span className="text-white font-black text-2xl">
                  Tec<span className="text-blue-400">nova</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                Votre spécialiste en matériel informatique en Tunisie depuis 2016. Qualité, performance et service irréprochable.
              </p>
              <div className="flex gap-3">
                {['fb', 'ig', 'tw', 'yt'].map((social) => (
                  <div key={social} className="w-9 h-9 rounded-xl bg-gray-800 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 cursor-pointer transition-all text-xs font-bold">
                    {social.toUpperCase()}
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              {
                title: 'Produits',
                links: ['Laptops', 'PC de Bureau', 'Moniteurs', 'Composants', 'Périphériques'],
              },
              {
                title: 'Service',
                links: ['Livraison', 'Garantie', 'Retours', 'Support Tech', 'FAQ'],
              },
              {
                title: 'Contact',
                links: ['📍 Tunis, Tunisia', '📞 +216 70 123 456', '📧 info@tecnova.tn', '⏰ Lun-Sam 9h-18h'],
              },
            ].map((col) => (
              <div key={col.title}>
                <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">{col.title}</h3>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <span className="text-gray-400 text-sm hover:text-blue-400 cursor-pointer transition-colors">
                        {link}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © 2026 Technova. Tous droits réservés. Matériel informatique en Tunisie.
            </p>
            <div className="flex items-center gap-4">
              {['Visa', 'MC', 'Paypal', 'D17'].map((pm) => (
                <div key={pm} className="px-3 py-1.5 bg-gray-800 border border-white/10 rounded-lg text-gray-400 text-xs font-bold">
                  {pm}
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
