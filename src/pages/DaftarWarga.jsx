import { useState } from 'react';
import { Search, Crown, Scroll, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function DaftarWarga() {
  const { warga, loading } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('semua');
  const [selectedWarga, setSelectedWarga] = useState(null);

  // Filter warga
  const filteredWarga = warga.filter(w => {
    const matchesSearch = w.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.alamat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.nik?.includes(searchTerm);
    const matchesStatus = statusFilter === 'semua' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Stats
  const stats = {
    total: warga.length,
    aktif: warga.filter(w => w.status === 'aktif').length,
    nonAktif: warga.filter(w => w.status === 'non-aktif').length,
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="Daftar Warga" />
        <div className="flex-1 p-4 lg:p-8 flex items-center justify-center" style={{ background: '#1A0F0A', minHeight: '100%' }}>
          <div className="text-center">
            <RefreshCw size={48} className="animate-spin mx-auto mb-4" style={{ color: '#DAA520' }} />
            <p style={{ color: '#DAA520' }}>Memuat warga...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Daftar Warga" />

      <div className="flex-1 p-4 lg:p-8 space-y-6" style={{ background: '#1A0F0A', minHeight: '100%' }}>
        {/* Stats Summary - Wayang Style */}
        <div className="grid grid-cols-3 gap-4">
          <div
            className="rounded-xl p-4"
            style={{
              background: 'linear-gradient(145deg, #2D1B0E 0%, #1A0F0A 100%)',
              border: '1px solid rgba(218, 165, 32, 0.2)'
            }}
          >
            <p className="text-sm mb-1" style={{ color: '#F5DEB3', opacity: 0.7 }}>Total Penduduk</p>
            <p className="text-2xl font-bold" style={{ fontFamily: 'Cinzel, serif', color: '#F5DEB3' }}>{stats.total}</p>
          </div>
          <div
            className="rounded-xl p-4"
            style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.2)'
            }}
          >
            <p className="text-sm mb-1" style={{ color: '#4ADE80' }}>Warga Aktif</p>
            <p className="text-2xl font-bold" style={{ fontFamily: 'Cinzel, serif', color: '#4ADE80' }}>{stats.aktif}</p>
          </div>
          <div
            className="rounded-xl p-4"
            style={{
              background: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.2)'
            }}
          >
            <p className="text-sm mb-1" style={{ color: '#F87171' }}>Non-Aktif</p>
            <p className="text-2xl font-bold" style={{ fontFamily: 'Cinzel, serif', color: '#F87171' }}>{stats.nonAktif}</p>
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
                placeholder="Cari nama, alamat, atau NIK..."
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

            {/* Status Filter */}
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
              <option value="aktif">Aktif</option>
              <option value="non-aktif">Non-Aktif</option>
            </select>
          </div>
        </div>

        {/* Warga Grid - Wayang Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWarga.map((w) => (
            <div
              key={w.id}
              className="rounded-xl p-5 cursor-pointer transition-all card-hover"
              style={{
                background: 'linear-gradient(145deg, #2D1B0E 0%, #1A0F0A 100%)',
                border: '1px solid rgba(218, 165, 32, 0.2)'
              }}
              onClick={() => setSelectedWarga(w)}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #8B0000 0%, #5C0000 100%)',
                    border: '2px solid #DAA520',
                    boxShadow: '0 0 15px rgba(218, 165, 32, 0.2)'
                  }}
                >
                  <Crown size={28} style={{ color: '#DAA520' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate" style={{ fontFamily: 'Cinzel, serif', color: '#F5DEB3' }}>{w.nama}</h4>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-sm" style={{ color: '#F5DEB3', opacity: 0.6 }}>
                      <span style={{ color: '#DAA520' }}>📍</span>
                      <span className="truncate">{w.alamat}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: '#F5DEB3', opacity: 0.6 }}>
                      <span style={{ color: '#DAA520' }}>📞</span>
                      <span>{w.telepon || '-'}</span>
                    </div>
                  </div>
                </div>
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: w.status === 'aktif' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(220, 38, 38, 0.2)',
                    color: w.status === 'aktif' ? '#4ADE80' : '#F87171',
                    border: `1px solid ${w.status === 'aktif' ? '#22c55e' : '#ef4444'}`
                  }}
                >
                  {w.status === 'aktif' ? 'Aktif' : 'Non-Aktif'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredWarga.length === 0 && (
          <div
            className="rounded-xl p-12 text-center"
            style={{
              background: 'linear-gradient(145deg, #2D1B0E 0%, #1A0F0A 100%)',
              border: '1px solid rgba(218, 165, 32, 0.2)'
            }}
          >
            <Scroll size={48} style={{ color: '#DAA520', opacity: 0.3, margin: '0 auto 16px' }} />
            <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Cinzel, serif', color: '#F5DEB3' }}>
              Tidak Ada Penduduk Ditemukan
            </h3>
            <p style={{ color: '#F5DEB3', opacity: 0.5 }}>Coba ubah kata kunci pencarian atau filter.</p>
          </div>
        )}
      </div>

      {/* Detail Modal - Wayang Style */}
      {selectedWarga && (
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
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(218, 165, 32, 0.2)',
                    border: '2px solid #DAA520'
                  }}
                >
                  <Crown size={32} style={{ color: '#DAA520' }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold" style={{ fontFamily: 'Cinzel, serif', color: '#DAA520' }}>
                    {selectedWarga.nama}
                  </h3>
                  <span
                    className="inline-block px-2 py-1 rounded-full text-xs font-medium mt-1"
                    style={{
                      backgroundColor: selectedWarga.status === 'aktif' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(220, 38, 38, 0.3)',
                      color: selectedWarga.status === 'aktif' ? '#4ADE80' : '#F87171'
                    }}
                  >
                    {selectedWarga.status === 'aktif' ? 'Warga Aktif' : 'Non-Aktif'}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
              >
                <span style={{ color: '#DAA520' }}>📍</span>
                <div>
                  <p className="text-xs" style={{ color: '#F5DEB3', opacity: 0.6 }}>Alamat</p>
                  <p className="font-medium" style={{ color: '#F5DEB3' }}>{selectedWarga.alamat}</p>
                </div>
              </div>
              <div
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
              >
                <span style={{ color: '#DAA520' }}>🪪</span>
                <div>
                  <p className="text-xs" style={{ color: '#F5DEB3', opacity: 0.6 }}>NIK</p>
                  <p className="font-medium" style={{ color: '#F5DEB3' }}>{selectedWarga.nik}</p>
                </div>
              </div>
              <div
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
              >
                <span style={{ color: '#DAA520' }}>📞</span>
                <div>
                  <p className="text-xs" style={{ color: '#F5DEB3', opacity: 0.6 }}>Telepon</p>
                  <p className="font-medium" style={{ color: '#F5DEB3' }}>{selectedWarga.telepon || '-'}</p>
                </div>
              </div>
              <div
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
              >
                <span style={{ color: '#DAA520' }}>📅</span>
                <div>
                  <p className="text-xs" style={{ color: '#F5DEB3', opacity: 0.6 }}>Tanggal Masuk</p>
                  <p className="font-medium" style={{ color: '#F5DEB3' }}>{formatDate(selectedWarga.tanggalMasuk)}</p>
                </div>
              </div>
            </div>
            <div className="p-4" style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(218, 165, 32, 0.2)' }}>
              <button
                onClick={() => setSelectedWarga(null)}
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
