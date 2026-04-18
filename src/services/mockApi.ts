// A3 - Mock API Server for Development (to be replaced with real backend)
// This provides simulated API responses for testing the frontend

import { Product, User, Order } from '../store/useStore';
import { products } from '../data/products';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Products
  products: {
    getAll: async () => {
      await delay(500);
      return { success: true, data: products };
    },
    getById: async (id: string) => {
      await delay(300);
      const product = products.find(p => p.id === id);
      if (!product) throw new Error('Product not found');
      return { success: true, data: product };
    },
    search: async (query: string) => {
      await delay(400);
      const results = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      );
      return { success: true, data: results };
    },
    getByCategory: async (category: string) => {
      await delay(300);
      const filtered = products.filter(p => p.category === category);
      return { success: true, data: filtered };
    },
  },

  // Authentication
  auth: {
    login: async (email: string, password: string) => {
      await delay(600);
      if (password.length < 6) {
        return { success: false, error: 'Mot de passe invalide' };
      }
      const user: User = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        email,
        role: email.includes('admin') ? 'admin' : 'user',
      };
      return { success: true, data: user };
    },
    register: async (userData: any) => {
      await delay(800);
      const user: User = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        name: userData.name,
        email: userData.email,
        role: 'user',
      };
      return { success: true, data: user };
    },
  },

  // Orders
  orders: {
    create: async (orderData: any) => {
      await delay(800);
      const order: Order = {
        id: 'ord_' + Math.random().toString(36).substr(2, 9),
        userId: orderData.userId,
        items: orderData.items,
        total: orderData.total,
        status: 'pending',
        date: new Date().toISOString(),
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
      };
      return { success: true, data: order };
    },
  },

  // Payments
  payments: {
    createIntent: async (amount: number) => {
      await delay(500);
      return {
        success: true,
        data: {
          clientSecret: 'pi_' + Math.random().toString(36).substr(2, 20),
          amount,
        },
      };
    },
  },
};
