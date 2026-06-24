// Seed script untuk Iuran RT
// Run: node prisma/seed.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.transaksi.deleteMany();
  await prisma.tagihan.deleteMany();
  await prisma.warga.deleteMany();
  await prisma.user.deleteMany();
  await prisma.konfigurasi.deleteMany();

  // Create Konfigurasi
  const konfigurasi = await prisma.konfigurasi.create({
    data: {
      namaRt: 'RT 03 RW 02',
      iuranSampah: 50000,
      iuranKeamanan: 10000,
    },
  });
  console.log('✅ Konfigurasi created');

  // Create Warga (Kepala Keluarga)
  const warga = await prisma.warga.createMany({
    data: [
      { nama: 'Budi Santoso', nik: '3201234567890001', alamat: 'Blok A1 No. 1', telepon: '081234567890', status: 'aktif' },
      { nama: 'H. Abdullah', nik: '3201234567890002', alamat: 'Blok A1 No. 2', telepon: '081234567891', status: 'aktif' },
      { nama: 'Ahmad Dahlan', nik: '3201234567890003', alamat: 'Blok A1 No. 3', telepon: '081234567892', status: 'aktif' },
      { nama: 'Dewi Lestari', nik: '3201234567890004', alamat: 'Blok B2 No. 1', telepon: '081234567893', status: 'aktif' },
      { nama: 'Rudi Hermawan', nik: '3201234567890005', alamat: 'Blok B2 No. 2', telepon: '081234567894', status: 'aktif' },
      { nama: 'Joko Widodo', nik: '3201234567890006', alamat: 'Blok B2 No. 3', telepon: '081234567895', status: 'non-aktif' },
      { nama: 'H. Hasan', nik: '3201234567890007', alamat: 'Blok C3 No. 1', telepon: '081234567896', status: 'aktif' },
      { nama: 'Hendra Wijaya', nik: '3201234567890008', alamat: 'Blok C3 No. 2', telepon: '081234567897', status: 'aktif' },
    ],
  });
  console.log('✅ 8 Warga created');

  // Get all warga for creating tagihan
  const allWarga = await prisma.warga.findMany();

  // Create Tagihan for Juni 2026
  for (const w of allWarga) {
    // Uang Sampah
    await prisma.tagihan.create({
      data: {
        idWarga: w.id,
        jenis: 'Uang Sampah',
        jumlah: 50000,
        bulan: 'Juni 2026',
        tanggalJatuhTempo: new Date('2026-06-15'),
        status: w.status === 'aktif' ? 'lunas' : 'terlambat',
        tanggalBayar: w.status === 'aktif' ? new Date('2026-06-10') : null,
        metodeBayar: w.status === 'aktif' ? 'Transfer Bank' : null,
      },
    });

    // Uang Keamanan
    await prisma.tagihan.create({
      data: {
        idWarga: w.id,
        jenis: 'Uang Keamanan',
        jumlah: 10000,
        bulan: 'Juni 2026',
        tanggalJatuhTempo: new Date('2026-06-15'),
        status: w.status === 'aktif' ? 'lunas' : 'terlambat',
        tanggalBayar: w.status === 'aktif' ? new Date('2026-06-10') : null,
        metodeBayar: w.status === 'aktif' ? 'Transfer Bank' : null,
      },
    });

    // Juli 2026 - Belum bayar
    await prisma.tagihan.create({
      data: {
        idWarga: w.id,
        jenis: 'Uang Sampah',
        jumlah: 50000,
        bulan: 'Juli 2026',
        tanggalJatuhTempo: new Date('2026-07-15'),
        status: 'belum_bayar',
      },
    });

    await prisma.tagihan.create({
      data: {
        idWarga: w.id,
        jenis: 'Uang Keamanan',
        jumlah: 10000,
        bulan: 'Juli 2026',
        tanggalJatuhTempo: new Date('2026-07-15'),
        status: 'belum_bayar',
      },
    });
  }
  console.log('✅ Tagihan created');

  // Create Transaksi (from Juni 2026 payments)
  const JuniWarga = allWarga.filter(w => w.status === 'aktif');

  for (let i = 0; i < JuniWarga.length; i++) {
    const w = JuniWarga[i];

    // Uang Sampah
    await prisma.transaksi.create({
      data: {
        idWarga: w.id,
        namaWarga: w.nama,
        jenis: 'Pemasukan',
        kategori: 'Uang Sampah',
        jumlah: 50000,
        tanggal: new Date(`2026-06-${8 + i}`),
        keterangan: 'Uang Sampah Juni 2026',
        metodeBayar: i % 2 === 0 ? 'Transfer Bank' : 'Tunai',
      },
    });

    // Uang Keamanan
    await prisma.transaksi.create({
      data: {
        idWarga: w.id,
        namaWarga: w.nama,
        jenis: 'Pemasukan',
        kategori: 'Uang Keamanan',
        jumlah: 10000,
        tanggal: new Date(`2026-06-${8 + i}`),
        keterangan: 'Uang Keamanan Juni 2026',
        metodeBayar: i % 2 === 0 ? 'Transfer Bank' : 'Tunai',
      },
    });
  }

  // Pengeluaran
  await prisma.transaksi.create({
    data: {
      jenis: 'Pengeluaran',
      kategori: 'Kebersihan',
      jumlah: 300000,
      tanggal: new Date('2026-06-05'),
      keterangan: 'Gaji tukang sampah',
    },
  });

  await prisma.transaksi.create({
    data: {
      jenis: 'Pengeluaran',
      kategori: 'Keamanan',
      jumlah: 600000,
      tanggal: new Date('2026-06-01'),
      keterangan: 'Gaji satpam',
    },
  });

  await prisma.transaksi.create({
    data: {
      jenis: 'Pengeluaran',
      kategori: 'Perbaikan',
      jumlah: 250000,
      tanggal: new Date('2026-06-10'),
      keterangan: 'Perbaikan lampu jalan',
    },
  });

  await prisma.transaksi.create({
    data: {
      jenis: 'Pengeluaran',
      kategori: 'Admin',
      jumlah: 25000,
      tanggal: new Date('2026-06-15'),
      keterangan: 'Biaya admin bank',
    },
  });

  console.log('✅ Transaksi created');

  // Create User (admin)
  await prisma.user.create({
    data: {
      nama: 'Admin RT',
      email: 'admin@iuranrt.com',
      password: 'admin123', // In production, hash this!
      role: 'admin',
    },
  });

  // Create User for Budi Santoso
  const budi = allWarga.find(w => w.nama === 'Budi Santoso');
  await prisma.user.create({
    data: {
      nama: budi.nama,
      email: 'budi@email.com',
      password: 'budi123', // In production, hash this!
      role: 'user',
      idWarga: budi.id,
    },
  });

  console.log('✅ Users created');
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
