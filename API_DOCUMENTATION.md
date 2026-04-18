# 📚 Documentation API - Technova

## Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_ENV=development
```

## 🔗 Endpoints API

### Products
```
GET    /products              - Récupérer tous les produits
GET    /products/:id          - Récupérer un produit
GET    /products/search?q=    - Rechercher des produits
GET    /products/category/:id - Produits par catégorie
```

### Authentication
```
POST   /auth/login            - Connexion
POST   /auth/register         - Inscription
POST   /auth/logout           - Déconnexion
POST   /auth/refresh          - Rafraîchir le token
```

### Orders
```
POST   /orders                - Créer une commande
GET    /orders/:id            - Détails de la commande
GET    /orders/user/:userId   - Commandes de l'utilisateur
PATCH  /orders/:id            - Modifier le statut
```

### User
```
GET    /user/profile          - Profil utilisateur
PUT    /user/profile          - Mettre à jour le profil
GET    /user/addresses        - Adresses de livraison
POST   /user/addresses        - Ajouter une adresse
```

### Payments
```
POST   /payments/intent       - Créer une intention de paiement
POST   /payments/validate     - Valider un paiement
GET    /payments/:id          - Statut du paiement
```

## 💻 Utilisation dans les composants

### Avec le hook useApi
```typescript
import { useApi } from '@/hooks/useApi';

export function MyComponent() {
  const { data, loading, error, request } = useApi('/products');

  const loadProducts = async () => {
    await request();
  };

  return (
    <div>
      {loading && <p>Chargement...</p>}
      {error && <p>Erreur: {error}</p>}
      {data && <pre>{JSON.stringify(data)}</pre>}
      <button onClick={loadProducts}>Charger</button>
    </div>
  );
}
```

### Avec le service api
```typescript
import { productsApi } from '@/services/api';

const products = await productsApi.getAll();
const search = await productsApi.search('laptop');
```

### Avec le mock API (développement local)
```typescript
import { mockApi } from '@/services/mockApi';

const products = await mockApi.products.getAll();
```

## 🔐 Authentification

Les tokens JWT sont stockés automatiquement dans le localStorage par le store Zustand.

Format du header :
```
Authorization: Bearer <token>
```

## 📦 Structure des réponses

### Succès
```json
{
  "success": true,
  "data": {...}
}
```

### Erreur
```json
{
  "success": false,
  "error": "Message d'erreur"
}
```

## 🛠️ Intégration Backend

Pour intégrer un vrai backend :

1. Remplacez `VITE_API_URL` dans `.env`
2. Assurez-vous que le backend implémente les endpoints
3. Les types TypeScript sont déjà prêts dans `useStore.ts`

## 🧪 Tester les API

Utilisez Postman ou cURL :

```bash
# Récupérer les produits
curl http://localhost:3000/api/products

# Rechercher
curl "http://localhost:3000/api/products/search?q=laptop"

# Créer une commande
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userId":"user_1","items":[],"total":0}'
```

## 📊 Performance

- Timeout par défaut: 10 secondes
- Cache automatique avec persist (Zustand)
- Gestion d'erreurs centralisée
