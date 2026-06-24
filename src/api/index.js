// API Base URL
const API_BASE = '/api';

async function fetchAPI(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'API Error');
  }

  return res.json();
}

// Dashboard API
export const apiDashboard = () => fetchAPI('/dashboard');

// Warga API
export const apiGetWarga = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchAPI(`/warga${query ? `?${query}` : ''}`);
};

// Tagihan API
export const apiGetTagihan = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchAPI(`/tagihan${query ? `?${query}` : ''}`);
};

// Bayar Tagihan API
export const apiBayarTagihan = (data) => {
  return fetchAPI('/bayar', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Transaksi API
export const apiGetTransaksi = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchAPI(`/transaksi${query ? `?${query}` : ''}`);
};

// Laporan API
export const apiGetLaporan = () => fetchAPI('/laporan');
