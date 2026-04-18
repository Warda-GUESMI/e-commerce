import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  stock: number;
  images: string[];
  description: string;
  specs: Record<string, string>;
  tags: string[];
  featured?: boolean;
  isNew?: boolean;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  phone?: string;
  address?: string;
  city?: string;
  orders?: Order[];
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  shippingAddress: string;
  paymentMethod: string;
}

export interface WishlistItem {
  productId: string;
}

interface StoreState {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // User
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;

  // Orders
  orders: Order[];
  addOrder: (order: Order) => void;

  // UI
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart
      cart: [],
      addToCart: (product, quantity = 1) => {
        const cart = get().cart;
        const existingItem = cart.find((item) => item.product.id === product.id);
        if (existingItem) {
          set({
            cart: cart.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ cart: [...cart, { product, quantity }] });
        }
      },
      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((item) => item.product.id !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set({
          cart: get().cart.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        return get().cart.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
      getCartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },

      // Wishlist
      wishlist: [],
      toggleWishlist: (productId) => {
        const wishlist = get().wishlist;
        if (wishlist.includes(productId)) {
          set({ wishlist: wishlist.filter((id) => id !== productId) });
        } else {
          set({ wishlist: [...wishlist, productId] });
        }
      },
      isInWishlist: (productId) => get().wishlist.includes(productId),

      // User
      currentUser: null,
      isAuthenticated: false,
      login: (user) => set({ currentUser: user, isAuthenticated: true }),
      logout: () => set({ currentUser: null, isAuthenticated: false }),
      updateUser: (userData) => {
        const currentUser = get().currentUser;
        if (currentUser) {
          set({ currentUser: { ...currentUser, ...userData } });
        }
      },

      // Orders
      orders: [],
      addOrder: (order) => set({ orders: [order, ...get().orders] }),

      // UI
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      selectedCategory: 'all',
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      isCartOpen: false,
      setIsCartOpen: (open) => set({ isCartOpen: open }),
      isMobileMenuOpen: false,
      setIsMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      currentPage: 'home',
      setCurrentPage: (page) => set({ currentPage: page }),
      selectedProduct: null,
      setSelectedProduct: (product) => set({ selectedProduct: product }),
    }),
    {
      name: 'technova-store',
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        orders: state.orders,
      }),
    }
  )
);
