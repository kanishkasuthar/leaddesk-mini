import axios from 'axios';

// Get base URL from environment or default to backend port 5001
const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/leads';
const API_BASE_URL = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const leadService = {
  // POST /api/leads - Capture new lead
  submitLead: async (leadData) => {
    const response = await api.post('', leadData);
    return response.data;
  },

  // GET /api/leads - Retrieve all leads
  getLeads: async () => {
    const response = await api.get('');
    return response.data;
  },

  // PUT /api/leads/:id - Update lead status
  updateStatus: async (id, status) => {
    const response = await api.put(`/${id}`, { status });
    return response.data;
  },

  // GET /api/leads/search?q=... - Search leads
  searchLeads: async (query) => {
    const response = await api.get('/search', {
      params: { q: query }
    });
    return response.data;
  },

  // GET /api/leads/stats - Fetch KPI dashboard metrics
  getStats: async () => {
    const response = await api.get('/stats');
    return response.data;
  }
};

export default api;
