// API: Get All Transaksi
import { prisma } from './prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { bulan, jenis } = req.query;

    const where = {};

    if (bulan && bulan !== 'semua') {
      // Parse bulan format "Juni 2026" or date format "2026-06"
      if (bulan.includes('-')) {
        const [year, month] = bulan.split('-');
        where.tanggal = {
          gte: new Date(parseInt(year), parseInt(month) - 1, 1),
          lte: new Date(parseInt(year), parseInt(month), 0),
        };
      }
    }

    if (jenis && jenis !== 'semua') {
      where.jenis = jenis;
    }

    const transaksi = await prisma.transaksi.findMany({
      where,
      orderBy: { tanggal: 'desc' },
    });

    return res.status(200).json(transaksi);
  } catch (error) {
    console.error('Get transaksi error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
