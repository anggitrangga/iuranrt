// API: Get Dashboard Stats
import { prisma } from './prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const now = new Date();
    const currentMonth = now.toLocaleString('id-ID', { month: 'long', year: 'numeric' });

    // Get counts
    const [totalWarga, wargaAktif, tagihanBulanIni, tagihanLunas, tagihanBelumBayar, tagihanTerlambat] = await Promise.all([
      prisma.warga.count(),
      prisma.warga.count({ where: { status: 'aktif' } }),
      prisma.tagihan.count({ where: { bulan: currentMonth } }),
      prisma.tagihan.count({ where: { bulan: currentMonth, status: 'lunas' } }),
      prisma.tagihan.count({ where: { bulan: currentMonth, status: 'belum_bayar' } }),
      prisma.tagihan.count({ where: { bulan: currentMonth, status: 'terlambat' } }),
    ]);

    // Get keuangan this month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const transaksiBulanIni = await prisma.transaksi.findMany({
      where: {
        tanggal: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    const totalPemasukan = transaksiBulanIni
      .filter(t => t.jenis === 'Pemasukan')
      .reduce((sum, t) => sum + t.jumlah, 0);

    const totalPengeluaran = transaksiBulanIni
      .filter(t => t.jenis === 'Pengeluaran')
      .reduce((sum, t) => sum + t.jumlah, 0);

    // Get total saldo from all transactions
    const allTransaksi = await prisma.transaksi.findMany();
    const totalPemasukanAll = allTransaksi
      .filter(t => t.jenis === 'Pemasukan')
      .reduce((sum, t) => sum + t.jumlah, 0);
    const totalPengeluaranAll = allTransaksi
      .filter(t => t.jenis === 'Pengeluaran')
      .reduce((sum, t) => sum + t.jumlah, 0);

    return res.status(200).json({
      totalWarga,
      wargaAktif,
      wargaNonAktif: totalWarga - wargaAktif,
      tagihanBulanIni,
      tagihanLunas,
      tagihanBelumBayar,
      tagihanTerlambat,
      totalPemasukanBulanIni: totalPemasukan,
      totalPengeluaranBulanIni: totalPengeluaran,
      saldo: totalPemasukanAll - totalPengeluaranAll,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
