# Documentation API — Technova

---

## Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet en vous basant sur `.env.example` :

```env
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_ENV=development
```

---

## Endpoints

### Produits

```
GET    /products                  Récupérer tous les produits
GET    /products/:id              Récupérer un produit par identifiant
GET    /products/search?q=        Rechercher des produits
GET    /products/category/:id     Filtrer par catégorie
```

### Authentification

```
POST   /auth/login                Connexion utilisateur
POST   /auth/register             Inscription
POST   /auth/logout               Déconnexion
POST   /auth/refresh              Rafraîchir le token JWT
```

### Commandes

```
POST   /orders                    Créer une commande
GET    /orders/:id                Détails d'une commande
GET    /orders/user/:userId       Commandes d'un utilisateur
PATCH  /orders/:id                Modifier le statut d'une commande
```

### Utilisateur

```
GET    /user/profile              Récupérer le profil
PUT    /user/profile              Mettre à jour le profil
GET    /user/addresses            Lister les adresses de livraison
POST   /user/addresses            Ajouter une adresse
```

### Paiements

```
POST   /payments/intent           Créer une intention de paiement
POST   /payments/validate         Valider un paiement
GET    /payments/:id              Consulter le statut d'un paiement
```

---

## Utilisation dans les composants

### Hook `useApi`

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

### Service `api`

```typescript
import { productsApi } from '@/services/api';

const products = await productsApi.getAll();
const search = await productsApi.search('laptop');
```

### Mock API (développement local)

```typescript
import { mockApi } from '@/services/mockApi';

const products = await mockApi.products.getAll();
```

---

## Authentification

Les tokens JWT sont gérés automatiquement par le store Zustand et persistés dans le localStorage. Chaque requête authentifiée doit inclure le header suivant :

```
Authorization: Bearer <token>
```

---

## Structure des réponses

### Succès

```json
{
  "success": true,
  "data": {}
}
```

### Erreur

```json
{
  "success": false,
  "error": "Message d'erreur"
}
```

---

## Intégration backend

Pour connecter un backend réel :

1. Renseignez `VITE_API_URL` dans le fichier `.env`
2. Assurez-vous que le backend expose les endpoints décrits ci-dessus
3. Les types TypeScript correspondants sont définis dans `useStore.ts`

---

## Tests des endpoints

Avec cURL :

```bash
# Récupérer tous les produits
curl http://localhost:3000/api/products

# Rechercher un produit
curl "http://localhost:3000/api/products/search?q=laptop"

# Créer une commande
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userId":"user_1","items":[],"total":0}'
```

Avec **Postman**, importez les endpoints directement depuis cette documentation.

---

## Performance et fiabilité

- Timeout par défaut : 10 secondes (configurable via `VITE_API_TIMEOUT`)
- Cache automatique avec persistance via Zustand
- Gestion d'erreurs centralisée au niveau du hook `useApi`
