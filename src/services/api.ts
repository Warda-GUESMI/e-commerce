// API Service Configuration
export const API_CONFIG = {
  BASE_URL: (import.meta as any).env.VITE_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000,
};

// Generic API response type
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// API request wrapper
export const apiCall = async <T,>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Products API
export const productsApi = {
  getAll: async () => apiCall('/products'),
  getById: async (id: string) => apiCall(`/products/${id}`),
  search: async (query: string) => apiCall(`/products/search?q=${query}`),
  getByCategory: async (category: string) => apiCall(`/products/category/${category}`),
};

// Orders API
export const ordersApi = {
  create: async (orderData: any) =>
    apiCall('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  getByUser: async (userId: string) => apiCall(`/orders/user/${userId}`),
  getById: async (orderId: string) => apiCall(`/orders/${orderId}`),
  updateStatus: async (orderId: string, status: string) =>
    apiCall(`/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// User API
export const userApi = {
  login: async (email: string, password: string) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: async (userData: any) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  getProfile: async () => apiCall('/user/profile'),
  updateProfile: async (userData: any) =>
    apiCall('/user/profile', {
      method: 'PATCH',
      body: JSON.stringify(userData),
    }),
};

// Payment API
export const paymentApi = {
  createPaymentIntent: async (amount: number) =>
    apiCall('/payments/intent', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),
  validatePayment: async (paymentId: string) =>
    apiCall(`/payments/${paymentId}/validate`, { method: 'POST' }),
};
