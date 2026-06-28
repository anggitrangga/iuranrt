// API: Register
import { prisma } from '../prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { nama, email, password, role, idWarga, alamat, telepon, nik } = req.body;

    if (!nama || !email || !password) {
      return res.status(400).json({ error: 'Nama, email, dan password harus diisi' });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }

    // If role is warga, create warga record too
    let wargaId = idWarga || null;

    if (role === 'warga' && !idWarga) {
      // Check if nik already exists
      if (nik) {
        const existingWarga = await prisma.warga.findUnique({
          where: { nik }
        });

        if (existingWarga) {
          wargaId = existingWarga.id;
        } else {
          // Create new warga
          const newWarga = await prisma.warga.create({
            data: {
              nama,
              nik: nik || `Warga-${Date.now()}`,
              alamat: alamat || '-',
              telepon: telepon || '-',
              status: 'aktif'
            }
          });
          wargaId = newWarga.id;
        }
      }
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        nama,
        email,
        password, // In production, hash this!
        role: role || 'warga',
        idWarga: wargaId,
        aktif: true
      },
      include: {
        warga: true
      }
    });

    // Generate simple token
    const token = Buffer.from(JSON.stringify({
      id: user.id,
      email: user.email,
      role: user.role,
      exp: Date.now() + 24 * 60 * 60 * 1000
    })).toString('base64');

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
        warga: user.warga
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}