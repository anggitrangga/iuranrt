import { createContext, useContext, useState, useCallback } from 'react';
import { wargaData, tagihanData, transaksiData, statistikData, currentUser } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [warga, setWarga] = useState(wargaData);
  const [tagihan, setTagihan] = useState(tagihanData);
  const [transaksi, setTransaksi] = useState(transaksiData);
  const [statistik, setStatistik] = useState(statistikData);
  const [user] = useState(currentUser);

  // Bayar tagihan
  const bayarTagihan = useCallback((idTagihan, metodeBayar) => {
    setTagihan(prev => prev.map(t =>
      t.id === idTagihan
        ? { ...t, status: 'lunas', tanggalBayar: new Date().toISOString().split('T')[0], metodeBayar }
        : t
    ));

    // Update statistik
    setStatistik(prev => ({
      ...prev,
      tagihanLunas: prev.tagihanLunas + 1,
      tagihanBelumBayar: prev.tagihanBelumBayar - 1,
    }));
  }, []);

  // Get tagihan untuk user saat ini
  const getTagihanUser = useCallback((userId) => {
    return tagihan.filter(t => t.idWarga === userId);
  }, [tagihan]);

  // Get tagihan berdasarkan status
  const getTagihanByStatus = useCallback((status) => {
    return tagihan.filter(t => t.status === status);
  }, [tagihan]);

  // Get warga berdasarkan status
  const getWargaByStatus = useCallback((status) => {
    return warga.filter(w => w.status === status);
  }, [warga]);

  // Get statistik real-time
  const getStatistikRealtime = useCallback(() => {
    const now = new Date();
    const bulanIni = now.toLocaleString('id-ID', { month: 'long', year: 'numeric' });

    const tagihanBulanIni = tagihan.filter(t => t.bulan === bulanIni);
    const lunas = tagihanBulanIni.filter(t => t.status === 'lunas').length;
    const belumBayar = tagihanBulanIni.filter(t => t.status === 'belum_bayar').length;
    const terlambat = tagihanBulanIni.filter(t => t.status === 'terlambat').length;

    const transaksiBulanIni = transaksi.filter(t => {
      const tanggal = new Date(t.tanggal);
      return tanggal.getMonth() === now.getMonth() && tanggal.getFullYear() === now.getFullYear();
    });

    const totalPemasukan = transaksiBulanIni
      .filter(t => t.jenis === 'Pemasukan')
      .reduce((sum, t) => sum + t.jumlah, 0);

    const totalPengeluaran = transaksiBulanIni
      .filter(t => t.jenis === 'Pengeluaran')
      .reduce((sum, t) => sum + t.jumlah, 0);

    return {
      totalWarga: warga.length,
      wargaAktif: warga.filter(w => w.status === 'aktif').length,
      wargaNonAktif: warga.filter(w => w.status === 'non-aktif').length,
      tagihanBulanIni: tagihanBulanIni.length,
      tagihanLunas: lunas,
      tagihanBelumBayar: belumBayar,
      tagihanTerlambat: terlambat,
      totalPemasukanBulanIni: totalPemasukan,
      totalPengeluaranBulanIni: totalPengeluaran,
      saldo: statistik.saldo + totalPemasukan - totalPengeluaran,
    };
  }, [warga, tagihan, transaksi, statistik.saldo]);

  const value = {
    warga,
    tagihan,
    transaksi,
    statistik,
    user,
    bayarTagihan,
    getTagihanUser,
    getTagihanByStatus,
    getWargaByStatus,
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
