import { useState } from 'react';
import { Search, Download, Eye, ScrollText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function DaftarTagihan() {
  const { tagihan } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('semua');
  const [jenisFilter, setJenisFilter] = useState('semua');
  const [selectedTagihan, setSelectedTagihan] = useState(null);

  // Filter tagihan
  const filteredTagihan = tagihan.filter(t => {
    const matchesSearch = t.namaWarga.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.jenis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.bulan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'semua' || t.status === statusFilter;
    const matchesJenis = jenisFilter === 'semua' || t.jenis === jenisFilter;
    return matchesSearch && matchesStatus && matchesJenis;
  });

  // Sort by tanggal jatuh tempo
  const sortedTagihan = [...filteredTagihan].sort((a, b) => {
    return new Date(a.tanggalJatuhTempo) - new Date(b.tanggalJatuhTempo);
  });

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const getStatusBadge = (status) => {
    const styles = {
      lunas: { bg: 'rgba(34, 197, 94, 0.2)', color: '#4ADE80', border: '1px solid #22c55e' },
      belum_bayar: { bg: 'rgba(234, 179, 8, 0.2)', color: '#FACC15', border: '1px solid #eab308' },
      terlambat: { bg: 'rgba(220, 38, 38, 0.2)', color: '#F87171', border: '1px solid #ef4444' },
    };
    const labels = {
      lunas: 'Lunas',
      belum_bayar: 'Belum Bayar',
      terlambat: 'Terlambat',
    };
    return (
      <span
        className="px-2 py-1 rounded-full text-xs font-medium"
        style={{ backgroundColor: styles[status].bg, color: styles[status].color, border: styles[status].border }}
      >
        {labels[status]}
      </span>
    );
  };

  // Stats
  const stats = {
    total: tagihan.length,
    lunas: tagihan.filter(t => t.status === 'lunas').length,
    belumBayar: tagihan.filter(t => t.status === 'belum_bayar').length,
    terlambat: tagihan.filter(t => t.status === 'terlambat').length,
  };

  const getAlamat = (idWarga) => {
    const alamatMap = {
      1: 'Blok A1 No. 1', 2: 'Blok A1 No. 2', 3: 'Blok A1 No. 3',
      4: 'Blok B2 No. 1', 5: 'Blok B2 No. 2', 6: 'Blok B2 No. 3',
      7: 'Blok C3 No. 1', 8: 'Blok C3 No. 2'
    };
    return alamatMap[idWarga] || '-';
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Daftar Tagihan" />

      <div className="flex-1 p-4 lg:p-8 space-y-6" style={{ background: '#1A0F0A', minHeight: '100%' }}>
        {/* Stats Summary - Wayang Style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            className="rounded-xl p-4"
            style={{
              background: 'linear-gradient(145deg, #2D1B0E 0%, #1A0F0A 100%)',
              border: '1px solid rgba(218, 165, 32, 0.2)'
            }}
          >
            <p className="text-sm mb-1" style={{ color: '#F5DEB3', opacity: 0.7 }}>Total Tagihan</p>
            <p className="text-2xl font-bold" style={{ fontFamily: 'Cinzel, serif', color: '#F5DEB3' }}>{stats.total}</p>
          </div>
          <div
            className="rounded-xl p-4"
            style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.2)'
            }}
          >
            <p className="text-sm mb-1" style={{ color: '#4ADE80' }}>Lunas</p>
            <p className="text-2xl font-bold" style={{ fontFamily: 'Cinzel, serif', color: '#4ADE80' }}>{stats.lunas}</p>
          </div>
          <div
            className="rounded-xl p-4"
            style={{
              background: 'rgba(234, 179, 8, 0.1)',
              border: '1px solid rgba(234, 179, 8, 0.2)'
            }}
          >
            <p className="text-sm mb-1" style={{ color: '#FACC15' }}>Belum Bayar</p>
            <p className="text-2xl font-bold" style={{ fontFamily: 'Cinzel, serif', color: '#FACC15' }}>{stats.belumBayar}</p>
          </div>
          <div
            className="rounded-xl p-4"
            style={{
              background: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.2)'
            }}
          >
            <p className="text-sm mb-1" style={{ color: '#F87171' }}>Terlambat</p>
            <p className="text-2xl font-bold" style={{ fontFamily: 'Cinzel, serif', color: '#F87171' }}>{stats.terlambat}</p>
          </div>
        </div>

        {/* Search and Filters - Wayang Style */}
        <div
          className="rounded-xl p-4"
          style={{
            background: 'linear-gradient(145deg, #2D1B0E 0%, #1A0F0A 100%)',
            border: '1px solid rgba(218, 165, 32, 0.2)'
          }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={20} style={{ color: '#DAA520' }} />
              <input
                type="text"
                placeholder="Cari nama warga, jenis tagihan, atau bulan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg outline-none"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(218, 165, 32, 0.2)',
                  color: '#F5DEB3'
                }}
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 rounded-lg outline-none"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(218, 165, 32, 0.2)',
                  color: '#F5DEB3'
                }}
              >
                <option value="semua">Semua Status</option>
                <option value="lunas">Lunas</option>
                <option value="belum_bayar">Belum Bayar</option>
                <option value="terlambat">Terlambat</option>
              </select>

              <select
                value={jenisFilter}
                onChange={(e) => setJenisFilter(e.target.value)}
                className="px-4 py-3 rounded-lg outline-none"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(218, 165, 32, 0.2)',
                  color: '#F5DEB3'
                }}
              >
                <option value="semua">Semua Jenis</option>
                <option value="Uang Sampah">Uang Sampah</option>
                <option value="Uang Keamanan">Uang Keamanan</option>
              </select>

              <button
                className="px-4 py-3 rounded-lg flex items-center gap-2 transition-all"
                style={{
                  backgroundColor: 'rgba(218, 165, 32, 0.2)',
                  color: '#DAA520',
                  border: '1px solid rgba(218, 165, 32, 0.3)'
                }}
              >
                <Download size={18} />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Tagihan Table - Wayang Style */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #2D1B0E 0%, #1A0F0A 100%)',
            border: '1px solid rgba(218, 165, 32, 0.2)'
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'rgba(218, 165, 32, 0.1)' }}>
                  <th className="text-left py-4 px-4 text-sm font-medium" style={{ color: '#DAA520' }}>No</th>
                  <th className="text-left py-4 px-4 text-sm font-medium" style={{ color: '#DAA520' }}>Nama Warga</th>
                  <th className="text-left py-4 px-4 text-sm font-medium" style={{ color: '#DAA520' }}>Alamat</th>
                  <th className="text-left py-4 px-4 text-sm font-medium" style={{ color: '#DAA520' }}>Jenis</th>
                  <th className="text-left py-4 px-4 text-sm font-medium" style={{ color: '#DAA520' }}>Bulan</th>
                  <th className="text-right py-4 px-4 text-sm font-medium" style={{ color: '#DAA520' }}>Jumlah</th>
                  <th className="text-left py-4 px-4 text-sm font-medium" style={{ color: '#DAA520' }}>Jatuh Tempo</th>
                  <th className="text-left py-4 px-4 text-sm font-medium" style={{ color: '#DAA520' }}>Status</th>
                  <th className="text-center py-4 px-4 text-sm font-medium" style={{ color: '#DAA520' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {sortedTagihan.map((t, index) => (
                  <tr
                    key={t.id}
                    style={{ borderBottom: '1px solid rgba(218, 165, 32, 0.1)' }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-4 text-sm" style={{ color: '#F5DEB3', opacity: 0.6 }}>{index + 1}</td>
                    <td className="py-4 px-4 text-sm font-medium" style={{ color: '#F5DEB3' }}>{t.namaWarga}</td>
                    <td className="py-4 px-4 text-sm" style={{ color: '#F5DEB3', opacity: 0.7 }}>{getAlamat(t.idWarga)}</td>
                    <td className="py-4 px-4 text-sm" style={{ color: '#F5DEB3', opacity: 0.7 }}>{t.jenis}</td>
                    <td className="py-4 px-4 text-sm" style={{ color: '#F5DEB3', opacity: 0.7 }}>{t.bulan}</td>
                    <td className="py-4 px-4 text-sm font-semibold text-right" style={{ color: '#DAA520' }}>
                      {formatCurrency(t.jumlah)}
                    </td>
                    <td className="py-4 px-4 text-sm" style={{ color: '#F5DEB3', opacity: 0.7 }}>
                      {new Date(t.tanggalJatuhTempo).toLocaleDateString('id-ID')}
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(t.status)}</td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setSelectedTagihan(t)}
                          className="p-2 rounded-lg transition-all"
                          style={{
                            backgroundColor: 'rgba(59, 130, 246, 0.2)',
                            color: '#60A5FA'
                          }}
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedTagihan.length === 0 && (
            <div className="py-12 text-center">
              <ScrollText size={48} style={{ color: '#DAA520', opacity: 0.3, margin: '0 auto 16px' }} />
              <p style={{ color: '#F5DEB3', opacity: 0.5 }}>Tidak ada tagihan yang ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal - Wayang Style */}
      {selectedTagihan && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div
            className="rounded-2xl w-full max-w-md overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #2D1B0E 0%, #1A0F0A 100%)',
              border: '2px solid rgba(218, 165, 32, 0.3)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(218, 165, 32, 0.1)'
            }}
          >
            <div
              className="p-6"
              style={{
                background: 'linear-gradient(90deg, #8B0000 0%, #5C0000 100%)',
                borderBottom: '2px solid #DAA520'
              }}
            >
              <h3 className="text-xl font-bold" style={{ fontFamily: 'Cinzel, serif', color: '#DAA520' }}>
                Prasasti Tagihan
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm" style={{ color: '#F5DEB3', opacity: 0.6 }}>Nama Warga</p>
                  <p className="font-medium" style={{ color: '#F5DEB3' }}>{selectedTagihan.namaWarga}</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: '#F5DEB3', opacity: 0.6 }}>Alamat</p>
                  <p className="font-medium" style={{ color: '#F5DEB3' }}>{getAlamat(selectedTagihan.idWarga)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm" style={{ color: '#F5DEB3', opacity: 0.6 }}>Jenis</p>
                  <p className="font-medium" style={{ color: '#F5DEB3' }}>{selectedTagihan.jenis}</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: '#F5DEB3', opacity: 0.6 }}>Bulan</p>
                  <p className="font-medium" style={{ color: '#F5DEB3' }}>{selectedTagihan.bulan}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm" style={{ color: '#F5DEB3', opacity: 0.6 }}>Jatuh Tempo</p>
                  <p className="font-medium" style={{ color: '#F5DEB3' }}>
                    {new Date(selectedTagihan.tanggalJatuhTempo).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: '#F5DEB3', opacity: 0.6 }}>Status</p>
                  {getStatusBadge(selectedTagihan.status)}
                </div>
              </div>
              <div
                className="p-4 rounded-xl text-center"
                style={{ backgroundColor: 'rgba(218, 165, 32, 0.1)', border: '1px solid rgba(218, 165, 32, 0.2)' }}
              >
                <p className="text-sm" style={{ color: '#F5DEB3', opacity: 0.6 }}>Jumlah Kewajiban</p>
                <p className="text-2xl font-bold" style={{ fontFamily: 'Cinzel, serif', color: '#DAA520' }}>
                  {formatCurrency(selectedTagihan.jumlah)}
                </p>
              </div>
              {selectedTagihan.status === 'lunas' && (
                <div className="grid grid-cols-2 gap-4 pt-4" style={{ borderTop: '1px solid rgba(218, 165, 32, 0.2)' }}>
                  <div>
                    <p className="text-sm" style={{ color: '#F5DEB3', opacity: 0.6 }}>Tanggal Bayar</p>
                    <p className="font-medium" style={{ color: '#4ADE80' }}>
                      {new Date(selectedTagihan.tanggalBayar).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: '#F5DEB3', opacity: 0.6 }}>Metode Bayar</p>
                    <p className="font-medium" style={{ color: '#4ADE80' }}>{selectedTagihan.metodeBayar}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4" style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(218, 165, 32, 0.2)' }}>
              <button
                onClick={() => setSelectedTagihan(null)}
                className="w-full py-2 rounded-lg font-medium transition-all"
                style={{
                  backgroundColor: 'rgba(218, 165, 32, 0.2)',
                  color: '#DAA520',
                  border: '1px solid rgba(218, 165, 32, 0.3)'
                }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
