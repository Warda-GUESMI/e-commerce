// Shared types for the application
export type PageType = 'home' | 'catalog' | 'product' | 'checkout' | 'login' | 'profile' | 'admin' | 'wishlist' | 'orders' | 'about' | 'promotions';

export type OnNavigate = (page: PageType) => void;
