import axios from 'axios';

// Get base URL from environment or default to backend port 5001
const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const API_BASE_URL = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Axios Request Interceptor: Attach JWT Token Automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('leaddesk_admin_token') || sessionStorage.getItem('leaddesk_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Axios Response Interceptor: Handle Expired / Invalid Tokens (401) Gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('leaddesk_admin_token');
      localStorage.removeItem('leaddesk_admin_user');
      sessionStorage.removeItem('leaddesk_admin_token');
      sessionStorage.removeItem('leaddesk_admin_user');

      window.dispatchEvent(new CustomEvent('session-expired', {
        detail: { message: error.response?.data?.message || 'Authentication session expired. Please log in again.' }
      }));
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // POST /api/auth/login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data && response.data.token) {
      const storage = credentials.rememberMe ? localStorage : sessionStorage;
      localStorage.removeItem('leaddesk_admin_token');
      localStorage.removeItem('leaddesk_admin_user');
      sessionStorage.removeItem('leaddesk_admin_token');
      sessionStorage.removeItem('leaddesk_admin_user');

      storage.setItem('leaddesk_admin_token', response.data.token);
      storage.setItem('leaddesk_admin_user', JSON.stringify(response.data.admin));
    }
    return response.data;
  },

  // POST /api/auth/register
  register: async (adminData) => {
    const response = await api.post('/auth/register', adminData);
    return response.data;
  },

  // GET /api/auth/me
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // POST /api/auth/forgot-password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // POST /api/auth/reset-password
  resetPassword: async (data) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  // Clear session & tokens
  logout: () => {
    localStorage.removeItem('leaddesk_admin_token');
    localStorage.removeItem('leaddesk_admin_user');
    sessionStorage.removeItem('leaddesk_admin_token');
    sessionStorage.removeItem('leaddesk_admin_user');
  },

  // Retrieve active token
  getToken: () => {
    return localStorage.getItem('leaddesk_admin_token') || sessionStorage.getItem('leaddesk_admin_token');
  },

  // Retrieve active admin user info
  getAdmin: () => {
    const userStr = localStorage.getItem('leaddesk_admin_user') || sessionStorage.getItem('leaddesk_admin_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
};

export const leadService = {
  // POST /api/leads - Capture new lead
  submitLead: async (leadData) => {
    const response = await api.post('/leads', leadData);
    return response.data;
  },

  // GET /api/leads - Retrieve all leads
  getLeads: async () => {
    const response = await api.get('/leads');
    return response.data;
  },

  // PUT /api/leads/:id - Update lead status
  updateStatus: async (id, status) => {
    const response = await api.put(`/leads/${id}`, { status });
    return response.data;
  },

  // GET /api/leads/search?q=... - Search leads
  searchLeads: async (query) => {
    const response = await api.get('/leads/search', {
      params: { q: query }
    });
    return response.data;
  },

  // GET /api/leads/stats - Fetch KPI metrics
  getStats: async () => {
    const response = await api.get('/leads/stats');
    return response.data;
  }
};

export default api;
