# ⚡ Quick Reference Guide - Technova

Guide rapide pour les tâches les plus courantes.

## 🚀 Démarrage

```bash
cd c:\\Users\\Warda Guesmi\\OneDrive\\Bureau\\mang
npm install
npm run dev
# Ouvrir http://localhost:5176
```

## 📝 Ajouter un Nouveau Produit

Éditer `src/data/products.ts`:

```typescript
{
  id: 'lap-003',
  name: 'Dell XPS 15',
  brand: 'Dell',
  category: 'laptops',
  price: 7299,
  originalPrice: 7999,
  discount: 8,
  rating: 4.9,
  reviews: 56,
  stock: 3,
  images: ['https://images.unsplash.com/...?w=600&q=80'],
  description: 'Votre description ici',
  specs: {
    'Processeur': 'Intel Core i9',
    'RAM': '32 GB DDR5',
    // ...
  },
  tags: ['tag1', 'tag2'],
  featured: true,
  badge: 'Bestseller',
}
```

## 🔗 Créer une Nouvelle Page

1. Créer le fichier dans `src/pages/MyPage.tsx`:

```typescript
type PageProps = {
  onNavigate: (page: string) => void;
};

export default function MyPage({ onNavigate }: PageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold">Ma Page</h1>
    </div>
  );
}
```

2. Importer dans `App.tsx`
3. Ajouter la route dans le switch

## 🎨 Utiliser les Couleurs du Design

```typescript
// Primary Colors
'bg-indigo-600'
'bg-blue-500'
'bg-violet-600'

// Secondary
'text-gray-400'
'bg-gray-900'

// Status
'text-green-400'  // Success
'text-red-400'    // Error
'text-yellow-300' // Warning
'text-blue-300'   // Info
```

## 📡 Appeler l'API

### Avec le hook useApi
```typescript
import { useApi } from '@/hooks/useApi';

const { data, loading, error, request } = useApi('/products');

const loadProducts = async () => {
  try {
    await request();
  } catch (err) {
    console.error(err);
  }
};
```

### Avec le service
```typescript
import { productsApi } from '@/services/api';

const products = await productsApi.getAll();
const search = await productsApi.search('laptop');
```

### Avec le mock API (dev)
```typescript
import { mockApi } from '@/services/mockApi';

const result = await mockApi.products.getAll();
console.log(result.data);
```

## 💾 Accéder à l'État Global (Zustand)

```typescript
import { useStore } from '@/store/useStore';

const MyComponent = () => {
  // Récupérer des valeurs
  const cart = useStore((state) => state.cart);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  
  // Appeler des actions
  const addToCart = useStore((state) => state.addToCart);
  const login = useStore((state) => state.login);
  
  const handleAddToCart = () => {
    const product = { /* ... */ };
    addToCart(product, 1);
  };
};
```

## 🔐 Login Utilisateur

```typescript
import { useStore } from '@/store/useStore';

const handleLogin = async (email: string, password: string) => {
  const { login } = useStore.getState();
  
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const { data } = await response.json();
    login(data.user);
    localStorage.setItem('token', data.token);
  } catch (error) {
    console.error('Login failed', error);
  }
};d: string) => {
  const { login } = useStore.getState();
  
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const { data } = await response.json();
    login(data.user);
    localStorage.setItem('token', data.token);
  } catch (error) {
    console.error('Login failed', error);
  }
};
```

## 💰 Afficher les Prix

```typescript
import { formatPrice } from '@/utils/format';

<span>{formatPrice(4599)}</span>
// Output: 4 599,000 د.ت
```

## 📅 Formater les Dates

```typescript
import { formatDate, formatDateTime } from '@/utils/format';

formatDate('2025-04-18')  // 18 avril 2025
formatDateTime('2025-04-18T14:30:00')  // 18 avril 2025 à 14:30:00
```

## ⭐ Ajouter Icônes

Utiliser lucide-react:

```typescript
import { ShoppingCart, Heart, Star, Search } from 'lucide-react';

<ShoppingCart size={24} />
<Heart size={20} />
<Star size={18} className="text-yellow-400" />
```

## 🎯 Afficher un Toast (Notification)

```typescript
import toast from 'react-hot-toast';

// Success
toast.success('Produit ajouté au panier !');

// Error
toast.error('Une erreur est survenue');

// Custom
toast.custom((t) => (
  <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
    Message personnalisé
  </div>
));
```

## 🔍 Rechercher des Produits

```typescript
import { useStore } from '@/store/useStore';

const MyComponent = () => {
  const { searchQuery, setSearchQuery } = useStore();
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
};
```

## 🔓 Check Authentification

```typescript
import { useStore } from '@/store/useStore';

const MyComponent = () => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const currentUser = useStore((state) => state.currentUser);
  
  if (!isAuthenticated) {
    return <LoginRequired />;
  }
  
  return <Dashboard user={currentUser} />;
};
```

## 📦 Ajouter un Package

```bash
npm install package-name
# ou pour dépendances dev
npm install -D package-name@latest
```

Packages recommandés:
- `react-router-dom` - Routing avancé
- `axios` - HTTP client alternatif
- `zod` - Validation schemas
- `swr` - Data fetching
- `react-query` - Caching avancé

## 🐛 Déboguer

```typescript
// Voir l'état Zustand
console.log(useStore.getState());

// Voir les requêtes API
fetch = (...args) => {
  console.log('API Call:', args);
  return original_fetch(...args);
};

// TypeScript errors
npm run build  // Voir tous les erreurs

// Vite debug
?debuggable=true  // En développement
```

## 🎨 Components Réutilisables

### ProductCard
```typescript
import ProductCard from '@/components/ProductCard';

<ProductCard 
  product={product}
  onViewProduct={(p) => console.log(p)}
/>
```

### CartSidebar
```typescript
import CartSidebar from '@/components/CartSidebar';

<CartSidebar onNavigate={(page) => console.log(page)} />
```

### Navbar
```typescript
import Navbar from '@/components/Navbar';

<Navbar 
  onNavigate={handleNavigate}
  currentPage={currentPage}
/>
```

## 🔧 Modifier les Configs

### Tailwind
Éditer `tailwindcss` in `package.json` ou `tailwind.config.js`

### Vite
Éditer `vite.config.ts`

### TypeScript
Éditer `tsconfig.json`

## 📊 Performance Tips

1. ✅ Utiliser React.memo pour components purs
2. ✅ useCallback pour les functions
3. ✅ useMemo pour les calculs lourds
4. ✅ Lazy loading des images
5. ✅ Code splitting
6. ✅ Tree shaking
7. ✅ Minification

## 🚀 Build & Deploy

```bash
# Development
npm run dev

# Production build
npm run build

# Preview build locally
npm run preview

# Size analysis
npm install -D rollup-plugin-visualizer
```

## 📞 Quand Vous Êtes Bloqué

1. Vérifiez la console (F12)
2. Lisez l'erreur TypeScript
3. Utilisez console.log pour déboguer
4. Vérifiez les `.env` variables
5. Assurez-vous que l'API est en ligne
6. Vérifiez le réseau (onglet Network)

## 🎁 Snippets Utiles

### Skeleton Loading
```typescript
<div className="animate-pulse bg-gray-800 rounded-lg h-40 w-full" />
```

### Empty State
```typescript
<div className="text-center py-12">
  <p className="text-gray-400">Aucun produit trouvé</p>
</div>
```

### Error Boundary
```typescript
export default function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="text-red-500 p-4">
      Une erreur: {error.message}
    </div>
  );
}
```

---

**Besoin d'aide ? Consultez le README.md ou API_DOCUMENTATION.md**
