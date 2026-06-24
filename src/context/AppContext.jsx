import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiDashboard, apiGetWarga, apiGetTagihan, apiBayarTagihan, apiGetLaporan } from '../api/index';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [warga, setWarga] = useState([]);
  const [tagihan, setTagihan] = useState([]);
  const [statistik, setStatistik] = useState({
    totalWarga: 0,
    wargaAktif: 0,
    wargaNonAktif: 0,
    tagihanBulanIni: 0,
    tagihanLunas: 0,
    tagihanBelumBayar: 0,
    tagihanTerlambat: 0,
    totalPemasukanBulanIni: 0,
    totalPengeluaranBulanIni: 0,
    saldo: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Current user (mock - in production, get from auth)
  const user = {
    id: '1',
    nama: 'Budi Santoso',
    email: 'budi@email.com',
    role: 'user',
  };

  // Fetch all data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [dashboard, wargaData, tagihanData] = await Promise.all([
        apiDashboard(),
        apiGetWarga(),
        apiGetTagihan(),
      ]);

      setStatistik(dashboard);
      setWarga(wargaData);
      setTagihan(tagihanData);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Bayar tagihan
  const bayarTagihan = useCallback(async (idTagihan, metodeBayar) => {
    try {
      await apiBayarTagihan({ id: idTagihan, metodeBayar });
      // Refresh data
      await fetchData();
      return { success: true };
    } catch (err) {
      console.error('Bayar error:', err);
      return { success: false, error: err.message };
    }
  }, [fetchData]);

  // Get tagihan untuk user saat ini (by nama)
  const getTagihanUser = useCallback((userId) => {
    // In production, match by userId/idWarga
    // For now, show all tagihan that match user's name
    return tagihan.filter(t => t.namaWarga === user?.nama);
  }, [tagihan, user?.nama]);

  // Get statistik real-time
  const getStatistikRealtime = useCallback(() => {
    return statistik;
  }, [statistik]);

  const value = {
    warga,
    tagihan,
    statistik,
    user,
    loading,
    error,
    fetchData,
    bayarTagihan,
    getTagihanUser,
    getStatistikRealtime,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
