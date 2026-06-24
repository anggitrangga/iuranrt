// API: Get All Warga
import { prisma } from './prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { status, search } = req.query;

    const where = {};

    if (status && status !== 'semua') {
      where.status = status;
    }

    let warga = await prisma.warga.findMany({
      where,
      orderBy: { nama: 'asc' },
    });

    // Search filter
    if (search) {
      warga = warga.filter(w =>
        w.nama.toLowerCase().includes(search.toLowerCase()) ||
        w.alamat.toLowerCase().includes(search.toLowerCase()) ||
        w.nik.includes(search)
      );
    }

    return res.status(200).json(warga);
  } catch (error) {
    console.error('Get warga error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
