// API: Login
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

// Simple JWT-like token (for demo - use proper JWT in production)
function generateToken(user) {
  const payload = JSON.stringify({
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  });
  return Buffer.from(payload).toString('base64');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password harus diisi' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { warga: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    if (!user.aktif) {
      return res.status(401).json({ error: 'Akun tidak aktif' });
    }

    // Check password (for demo, accept plain text password too)
    const isValidPassword = password === user.password ||
      (user.password.startsWith('$2') && await bcrypt.compare(password, user.password));

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    // Generate token
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
        warga: user.warga ? {
          id: user.warga.id,
          nama: user.warga.nama,
          alamat: user.warga.alamat
        } : null
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}