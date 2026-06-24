// API: Get All Tagihan
import { prisma } from './prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { status, jenis, search } = req.query;

    const where = {};

    if (status && status !== 'semua') {
      where.status = status;
    }

    if (jenis && jenis !== 'semua') {
      where.jenis = jenis;
    }

    let tagihan = await prisma.tagihan.findMany({
      where,
      include: {
        warga: {
          select: {
            nama: true,
            alamat: true,
          },
        },
      },
      orderBy: { tanggalJatuhTempo: 'asc' },
    });

    // Format response
    tagihan = tagihan.map(t => ({
      id: t.id,
      idWarga: t.idWarga,
      namaWarga: t.warga.nama,
      alamat: t.warga.alamat,
      jenis: t.jenis,
      jumlah: t.jumlah,
      bulan: t.bulan,
      tanggalJatuhTempo: t.tanggalJatuhTempo,
      status: t.status,
      tanggalBayar: t.tanggalBayar,
      metodeBayar: t.metodeBayar,
    }));

    // Search filter (after getting warga info)
    if (search) {
      tagihan = tagihan.filter(t =>
        t.namaWarga.toLowerCase().includes(search.toLowerCase()) ||
        t.jenis.toLowerCase().includes(search.toLowerCase()) ||
        t.bulan.toLowerCase().includes(search.toLowerCase())
      );
    }

    return res.status(200).json(tagihan);
  } catch (error) {
    console.error('Get tagihan error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
