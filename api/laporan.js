// API: Get Laporan Keuangan (Stats + Charts Data)
import { prisma } from './prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all transaksi
    const transaksi = await prisma.transaksi.findMany({
      orderBy: { tanggal: 'desc' },
    });

    // Calculate totals
    const totalPemasukan = transaksi
      .filter(t => t.jenis === 'Pemasukan')
      .reduce((sum, t) => sum + t.jumlah, 0);

    const totalPengeluaran = transaksi
      .filter(t => t.jenis === 'Pengeluaran')
      .reduce((sum, t) => sum + t.jumlah, 0);

    // This month calculations
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const transaksiBulanIni = transaksi.filter(t => {
      const tgl = new Date(t.tanggal);
      return tgl >= startOfMonth && tgl <= endOfMonth;
    });

    const totalPemasukanBulanIni = transaksiBulanIni
      .filter(t => t.jenis === 'Pemasukan')
      .reduce((sum, t) => sum + t.jumlah, 0);

    const totalPengeluaranBulanIni = transaksiBulanIni
      .filter(t => t.jenis === 'Pengeluaran')
      .reduce((sum, t) => sum + t.jumlah, 0);

    // Monthly trend (last 6 months)
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = d.toLocaleString('id-ID', { month: 'short' });
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);

      const monthTransaksi = transaksi.filter(t => {
        const tgl = new Date(t.tanggal);
        return tgl >= start && tgl <= end;
      });

      monthlyTrend.push({
        name: monthName,
        pemasukan: monthTransaksi.filter(t => t.jenis === 'Pemasukan').reduce((sum, t) => sum + t.jumlah, 0),
        pengeluaran: monthTransaksi.filter(t => t.jenis === 'Pengeluaran').reduce((sum, t) => sum + t.jumlah, 0),
      });
    }

    // Pengeluaran per kategori
    const pengeluaranKategori = {};
    transaksi
      .filter(t => t.jenis === 'Pengeluaran')
      .forEach(t => {
        pengeluaranKategori[t.kategori] = (pengeluaranKategori[t.kategori] || 0) + t.jumlah;
      });

    const pieData = Object.entries(pengeluaranKategori).map(([name, value]) => ({
      name,
      value,
    }));

    // Iuran per kategori
    const iuranKategori = {};
    transaksi
      .filter(t => t.jenis === 'Pemasukan')
      .forEach(t => {
        iuranKategori[t.kategori] = (iuranKategori[t.kategori] || 0) + t.jumlah;
      });

    const barData = Object.entries(iuranKategori).map(([name, value]) => ({
      name,
      value,
    }));

    return res.status(200).json({
      stats: {
        saldo: totalPemasukan - totalPengeluaran,
        totalPemasukanBulanIni,
        totalPengeluaranBulanIni,
        saldoBersih: totalPemasukanBulanIni - totalPengeluaranBulanIni,
      },
      trendData: monthlyTrend,
      pieData,
      barData,
      transaksi: transaksi.slice(0, 20), // Latest 20 transactions
    });
  } catch (error) {
    console.error('Laporan error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
