// Seed script untuk Iuran RT
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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
  await prisma.konfigurasi.create({
    data: {
      namaRt: 'RT 03 RW 02',
      alamatRt: 'Jl. Mawar Indah No. 1',
      iuranSampah: 50000,
      iuranKeamanan: 10000,
      batasPembayaran: 15,
    },
  });
  console.log('✅ Konfigurasi created');

  // Create Users first
  const adminPassword = await bcrypt.hash('admin123', 10);
  const bendaharaPassword = await bcrypt.hash('bendahara123', 10);
  const wargaPassword = await bcrypt.hash('warga123', 10);

  const admin = await prisma.user.create({
    data: {
      nama: 'Administrator',
      email: 'admin@iuranrt.com',
      password: adminPassword,
      role: 'admin',
      aktif: true,
    },
  });
  console.log('✅ Admin created (email: admin@iuranrt.com, password: admin123)');

  // Create Warga
  const wargaData = [
    { nama: 'Budi Santoso', nik: '3201234567890001', alamat: 'Blok A1 No. 1', telepon: '081234567890' },
    { nama: 'H. Abdullah', nik: '3201234567890002', alamat: 'Blok A1 No. 2', telepon: '081234567891' },
    { nama: 'Ahmad Dahlan', nik: '3201234567890003', alamat: 'Blok A1 No. 3', telepon: '081234567892' },
    { nama: 'Dewi Lestari', nik: '3201234567890004', alamat: 'Blok B2 No. 1', telepon: '081234567893' },
    { nama: 'Rudi Hermawan', nik: '3201234567890005', alamat: 'Blok B2 No. 2', telepon: '081234567894' },
    { nama: 'Joko Widodo', nik: '3201234567890006', alamat: 'Blok B2 No. 3', telepon: '081234567895', status: 'non-aktif' },
    { nama: 'H. Hasan', nik: '3201234567890007', alamat: 'Blok C3 No. 1', telepon: '081234567896' },
    { nama: 'Hendra Wijaya', nik: '3201234567890008', alamat: 'Blok C3 No. 2', telepon: '081234567897' },
  ];

  const wargaList = await Promise.all(
    wargaData.map(w => prisma.warga.create({
      data: { ...w, status: w.status || 'aktif' }
    }))
  );
  console.log(`✅ ${wargaList.length} Warga created`);

  // Create Bendahara
  const bendahara = await prisma.user.create({
    data: {
      nama: 'Bendahara RT',
      email: 'bendahara@iuranrt.com',
      password: bendaharaPassword,
      role: 'bendahara',
      aktif: true,
    },
  });
  console.log('✅ Bendahara created (email: bendahara@iuranrt.com, password: bendahara123)');

  // Create User for Budi Santoso (Warga)
  const budiWarga = wargaList[0];
  const wargaUser = await prisma.user.create({
    data: {
      nama: budiWarga.nama,
      email: 'budi@iuranrt.com',
      password: wargaPassword,
      role: 'warga',
      idWarga: budiWarga.id,
      aktif: true,
    },
  });
  console.log('✅ Warga user created (email: budi@iuranrt.com, password: warga123)');

  // Create Tagihan for all warga (Juni 2026)
  for (const w of wargaList) {
    // Skip non-aktif warga
    if (w.status === 'non-aktif') continue;

    // Uang Sampah
    await prisma.tagihan.create({
      data: {
        idWarga: w.id,
        jenis: 'Uang Sampah',
        jumlah: 50000,
        bulan: 'Juni 2026',
        tanggalJatuhTempo: new Date('2026-06-15'),
        status: 'lunas',
        tanggalBayar: new Date('2026-06-10'),
        metodeBayar: 'Transfer Bank',
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
        status: 'lunas',
        tanggalBayar: new Date('2026-06-10'),
        metodeBayar: 'Transfer Bank',
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
  const aktifWarga = wargaList.filter(w => w.status === 'aktif');

  for (let i = 0; i < aktifWarga.length; i++) {
    const w = aktifWarga[i];

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
        inputBy: bendahara.id,
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
        inputBy: bendahara.id,
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
      inputBy: bendahara.id,
    },
  });

  await prisma.transaksi.create({
    data: {
      jenis: 'Pengeluaran',
      kategori: 'Keamanan',
      jumlah: 600000,
      tanggal: new Date('2026-06-01'),
      keterangan: 'Gaji satpam',
      inputBy: bendahara.id,
    },
  });

  await prisma.transaksi.create({
    data: {
      jenis: 'Pengeluaran',
      kategori: 'Perbaikan',
      jumlah: 250000,
      tanggal: new Date('2026-06-10'),
      keterangan: 'Perbaikan lampu jalan',
      inputBy: bendahara.id,
    },
  });

  await prisma.transaksi.create({
    data: {
      jenis: 'Pengeluaran',
      kategori: 'Admin',
      jumlah: 25000,
      tanggal: new Date('2026-06-15'),
      keterangan: 'Biaya admin bank',
      inputBy: bendahara.id,
    },
  });

  console.log('✅ Transaksi created');

  console.log('');
  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('📋 Login Credentials:');
  console.log('   Admin:     admin@iuranrt.com / admin123');
  console.log('   Bendahara: bendahara@iuranrt.com / bendahara123');
  console.log('   Warga:     budi@iuranrt.com / warga123');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });