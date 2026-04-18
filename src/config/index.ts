// Global configuration
export const config = {
  app: {
    name: 'Technova',
    version: '1.0.0',
    description: 'Votre spécialiste en matériel informatique en Tunisie',
  },
  api: {
    baseUrl: (import.meta as any).env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: parseInt((import.meta as any).env.VITE_API_TIMEOUT || '10000'),
  },
  payment: {
    stripeKey: (import.meta as any).env.VITE_STRIPE_PUBLIC_KEY,
  },
  features: {
    freeShippingThreshold: 500, // TND
    freeShippingEverywhere: true,
    shippingTime: '24-48h',
  },
  currency: {
    code: 'TND',
    symbol: 'د.ت',
    decimals: 3,
  },
  images: {
    defaultProductImage: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&q=80',
    placeholders: {
      product: 'https://via.placeholder.com/400x400?text=Product',
      banner: 'https://via.placeholder.com/1200x400?text=Banner',
      avatar: 'https://via.placeholder.com/80x80?text=Avatar',
    },
  },
};
