// API: Bayar Tagihan
import { prisma } from './prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id, metodeBayar } = req.body;

    if (!id || !metodeBayar) {
      return res.status(400).json({ error: 'ID and metodeBayar are required' });
    }

    // Get tagihan
    const tagihan = await prisma.tagihan.findUnique({
      where: { id },
      include: { warga: true },
    });

    if (!tagihan) {
      return res.status(404).json({ error: 'Tagihan not found' });
    }

    if (tagihan.status === 'lunas') {
      return res.status(400).json({ error: 'Tagihan sudah lunas' });
    }

    // Update tagihan
    const updatedTagihan = await prisma.tagihan.update({
      where: { id },
      data: {
        status: 'lunas',
        tanggalBayar: new Date(),
        metodeBayar,
      },
    });

    // Create transaksi
    await prisma.transaksi.create({
      data: {
        idWarga: tagihan.idWarga,
        namaWarga: tagihan.warga.nama,
        jenis: 'Pemasukan',
        kategori: tagihan.jenis,
        jumlah: tagihan.jumlah,
        tanggal: new Date(),
        keterangan: `${tagihan.jenis} ${tagihan.bulan}`,
        metodeBayar,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Pembayaran berhasil',
      tagihan: updatedTagihan,
    });
  } catch (error) {
    console.error('Bayar tagihan error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
