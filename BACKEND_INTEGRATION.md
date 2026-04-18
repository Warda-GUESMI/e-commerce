# 🔌 Guide d'Intégration Backend - Technova

Ce guide vous aide à connecter votre frontend à un vrai backend.

## 🎯 Étapes d'Intégration

### 1. Configurer l'URL API

**Fichier: `.env`**
```env
VITE_API_URL=https://votre-api.com/api
VITE_API_TIMEOUT=10000
VITE_ENV=production
```

### 2. Endpoints Requis

Votre backend doit implémenter ces endpoints :

#### **Products** 📦
```
GET  /products               -  Tous les produits
GET  /products/:id           -  Un produit par ID
GET  /products/search?q=term -  Rechercher
GET  /products/category/:cat -  Par catégorie
```

**Réponse exemple:**
```json
{
  "success": true,
  "data": [
    {
      "id": "prod-1",
      "name": "Laptop Gaming",
      "price": 4599,
      "images": ["https://..."],
      "stock": 5,
      "rating": 4.8,
      "reviews": 124
    }
  ]
}
```

#### **Authentification** 🔐
```
POST /auth/login      - Connexion
POST /auth/register   - Inscription
POST /auth/logout     - Déconnexion
GET  /auth/me         - Profil actuel
POST /auth/refresh    - Rafraîchir token
```

**Login Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user_123",
      "name": "Ahmed",
      "email": "ahmed@example.com",
      "role": "user"
    }
  }
}
```

#### **Commandes** 📋
```
POST   /orders              - Créer une commande
GET    /orders/:id          - Détails
GET    /orders/user/:userId - Mes commandes
PATCH  /orders/:id          - Modifier statut
DELETE /orders/:id          - Annuler
```

#### **Utilisateur** 👤
```
GET    /user/profile        - Mon profil
PUT    /user/profile        - Mettre à jour
DELETE /user/account        - Supprimer compte
```

#### **Paiements** 💳
```
POST   /payments/intent     - Créer intention
POST   /payments/:id/confirm - Confirmer
GET    /payments/:id/status  - Statut
```

## 🔐 Authentification avec Token JWT

### Token dans les Headers

Votre backend basé sur JWT doit vérifier ce header :

```
Authorization: Bearer <token>
```

### Implémenter dans le Frontend

Modifiez `/src/services/api.ts` :

```typescript
export const apiCall = async <T,>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = localStorage.getItem('auth-token');
  
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });

    if (response.status === 401) {
      // Token expiré - rediriger vers login
      window.location.href = '/auth';
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
```

## 📊 Modèles de Données

### Product
```typescript
{
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string;
  images: string[];
  rating: number;
  reviews: number;
  stock: number;
  specs: Record<string, string>;
  badge?: string;
  featured?: boolean;
  isNew?: boolean;
}
```

### User
```typescript
{
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  phone?: string;
  address?: string;
  city?: string;
}
```

### Order
```typescript
{
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  date: string;
  shippingAddress: string;
  paymentMethod: string;
}
```

## 🧪 Tester l'API

### Avec Postman

1. Créer une collection "Technova"
2. Ajouter les endpoints
3. Passer le token dans Authorization (Bearer)

### Avec cURL

```bash
# Récupérer produits
curl http://localhost:3000/api/products

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Créer commande (avec token)
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "userId": "user_123",
    "items": [{"productId": "prod_1", "quantity": 2}],
    "total": 9198,
    "shippingAddress": "Tunis"
  }'
```

## ⚙️ Gestion des Erreurs

Votre API doit renvoyer des codes HTTP corrects :

```json
{
  "success": false,
  "error": "Email déjà utilisé",
  "code": "EMAIL_EXISTS"
}
```

Les codes d'erreur supportés :

- `UNAUTHORIZED` (401) - Token invalide
- `FORBIDDEN` (403) - Accès refusé
- `NOT_FOUND` (404) - Ressource introuvable
- `VALIDATION_ERROR` (400) - Données invalides
- `CONFLICT` (409) - Conflit (email existe, etc)
- `SERVER_ERROR` (500) - Erreur serveur

## 🚀 Exemple : Backend Node.js/Express

```javascript
// backend/routes/products.js
const express = require('express');
const router = express.Router();

router.get('/products', (req, res) => {
  // Récupérer depuis la base de données
  const products = db.query('SELECT * FROM products');
  res.json({ success: true, data: products });
});

router.get('/products/:id', (req, res) => {
  const product = db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  res.json({ success: true, data: product });
});

module.exports = router;
```

## 🔄 Workflow d'Achat Complet

1. **Client explore les produits** → GET /products
2. **Client se connecte** → POST /auth/login (reçoit token)
3. **Client ajoute au panier** → State local (Zustand)
4. **Client vérifie le panier** → GET /products/:id (vérifier stock)
5. **Client crée commande** → POST /orders (avec token)
6. **Client paye** → POST /payments/intent + confirmation
7. **Commande confirmée** → PATCH /orders/:id (status: 'confirmed')
8. **Client suit la commande** → GET /orders/:id

## 💡 Conseils

1. ✅ Implémentez CORS correctement
2. ✅ Validez TOUTES les données côté serveur
3. ✅ Utilisez HTTPS en production
4. ✅ Hashez les mots de passe (bcrypt)
5. ✅ Expirez les tokens (15 minutes)
6. ✅ Rate limiting sur les endpoints
7. ✅ Logs des erreurs
8. ✅ Versionnez votre API (/api/v1/)

## 📚 Ressources

- [JWT.io](https://jwt.io) - Debugger JWT
- [Express.js](https://expressjs.com) - Framework Backend
- [Mongoose](https://mongoosejs.com) - MongoDB ODM
- [Strapi](https://strapi.io) - Headless CMS

---

Besoin d'aide ? Contactez : dev@technova.tn
