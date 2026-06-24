import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Download, RefreshCw, Crown, Scroll } from 'lucide-react';
import { apiGetLaporan } from '../api/index';
import Header from '../components/Header';

export default function LaporanKeuangan() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await apiGetLaporan();
      setData(result);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching laporan:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  // Wayang theme colors
  const COLORS = ['#DAA520', '#FACC15', '#F87171', '#8B6914', '#22c55e'];

  // Custom tooltip style
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="rounded-lg p-3"
          style={{
            background: 'linear-gradient(145deg, #2D1B0E 0%, #1A0F0A 100%)',
            border: '1px solid rgba(218, 165, 32, 0.3)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}
        >
          <p className="font-semibold mb-2" style={{ fontFamily: 'Cinzel, serif', color: '#DAA520' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, fontFamily: 'Cinzel, serif' }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="Laporan Keuangan" />
        <div className="flex-1 p-4 lg:p-8 flex items-center justify-center" style={{ background: '#1A0F0A', minHeight: '100%' }}>
          <div className="text-center">
            <RefreshCw size={48} className="animate-spin mx-auto mb-4" style={{ color: '#DAA520' }} />
            <p style={{ color: '#DAA520' }}>Memuat laporan...</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {
    saldo: 0,
    totalPemasukanBulanIni: 0,
    totalPengeluaranBulanIni: 0,
    saldoBersih: 0
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Laporan Keuangan" />

      <div className="flex-1 p-4 lg:p-8 space-y-6" style={{ background: '#1A0F0A', minHeight: '100%' }}>
        {/* Header Actions - Wayang Style */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 text-sm" style={{ color: '#DAA520' }}>
            <RefreshCw size={16} className="animate-spin-slow" />
            <span>Update: {lastUpdate.toLocaleTimeString('id-ID')}</span>
            <button
              onClick={fetchData}
              className="p-1 rounded transition-all hover:bg-white/10"
              title="Refresh Data"
              style={{ color: '#DAA520' }}
            >
              <RefreshCw size={16} />
            </button>
          </div>
          <button
            className="px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-all"
            style={{
              backgroundColor: 'rgba(218, 165, 32, 0.2)',
              color: '#DAA520',
              border: '1px solid rgba(218, 165, 32, 0.3)'
            }}
          >
            <Download size={16} />
            Export PDF
          </button>
        </div>

        {/* Summary Cards - Wayang Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            className="rounded-xl p-5"
            style={{
              background: 'linear-gradient(145deg, #2D1B0E 0%, #1A0F0A 100%)',
              border: '1px solid rgba(218, 165, 32, 0.3)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2), 0 0 20px rgba(218, 165, 32, 0.1)'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#F5DEB3', opacity: 0.7 }}>Total Kas</p>
                <p className="text-2xl font-bold" style={{ fontFamily: 'Cinzel, serif', color: '#DAA520' }}>
                  {formatCurrency(stats.saldo)}
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(218, 165, 32, 0.2)',
                  border: '1px solid rgba(218, 165, 32, 0.3)'
                }}
              >
                <Crown size={24} style={{ color: '#DAA520' }} />
              </div>
            </div>
          </div>
          <div
            className="rounded-xl p-5"
            style={{
              background: 'linear-gradient(145deg, #2D1B0E 0%, #1A0F0A 100%)',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#F5DEB3', opacity: 0.7 }}>Pemasukan Bulan Ini</p>
                <p className="text-2xl font-bold" style={{ fontFamily: 'Cinzel, serif', color: '#60A5FA' }}>
                  {formatCurrency(stats.totalPemasukanBulanIni)}
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(59, 130, 246, 0.2)' }}
              >
                <TrendingUp size={24} style={{ color: '#60A5FA' }} />
              </div>
            </div>
          </div>
          <div
            className="rounded-xl p-5"
            style={{
              background: 'linear-gradient(145deg, #2D1B0E 0%, #1A0F0A 100%)',
              border: '1px solid rgba(220, 38, 38, 0.3)'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#F5DEB3', opacity: 0.7 }}>Pengeluaran Bulan Ini</p>
                <p className="text-2xl font-bold" style={{ fontFamily: 'Cinzel, serif', color: '#F87171' }}>
                  {formatCurrency(stats.totalPengeluaranBulanIni)}
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(220, 38, 38, 0.2)' }}
              >
                <TrendingDown size={24} style={{ color: '#F87171' }} />
              </div>
            </div>
          </div>
          <div
            className="rounded-xl p-5"
            style={{
              background: 'linear-gradient(145deg, #2D1B0E 0%, #1A0F0A 100%)',
              border: stats.saldoBersih >= 0
                ? '1px solid rgba(34, 197, 94, 0.3)'
                : '1px solid rgba(220, 38, 38, 0.3)'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#F5DEB3', opacity: 0.7 }}>Saldo Bersih</p>
                <p
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: 'Cinzel, serif',
                    color: stats.saldoBersih >= 0 ? '#4ADE80' : '#F87171'
                  }}
                >
                  {formatCurrency(stats.saldoBersih)}
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: stats.saldoBersih >= 0
                    ? 'rgba(34, 197, 94, 0.2)'
                    : 'rgba(220, 38, 38, 0.2)'
                }}
              >
                {stats.saldoBersih >= 0 ? (
                  <TrendingUp size={24} style={{ color: '#4ADE80' }} />
                ) : (
                  <TrendingDown size={24} style={{ color: '#F87171' }} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row - Wayang Style */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart - Trend Bulanan */}
          <div
            className="rounded-xl p-6"
            style={{
              background: 'linear-gradient(145deg, #2D1B0E 0%, #1A0F0A 100%)',
              border: '1px solid rgba(218, 165, 32, 0.2)'
            }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: 'Cinzel, serif', color: '#DAA520' }}>
              <Scroll size={20} />
              Trend Kas 6 Bulan Terakhir
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.trendData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(218, 165, 32, 0.1)" />
                  <XAxis dataKey="name" stroke="#F5DEB3" fontSize={12} style={{ fontFamily: 'Cinzel, serif' }} />
                  <YAxis stroke="#F5DEB3" fontSize={12} tickFormatter={(value) => `${value / 1000}K`} style={{ fontFamily: 'Cinzel, serif' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontFamily: 'Cinzel, serif', color: '#F5DEB3' }}
                    formatter={(value) => <span style={{ color: '#F5DEB3' }}>{value}</span>}
                  />
                  <Line type="monotone" dataKey="pemasukan" stroke="#4ADE80" strokeWidth={3} dot={{ fill: '#4ADE80', strokeWidth: 2 }} name="Pemasukan" />
                  <Line type="monotone" dataKey="pengeluaran" stroke="#F87171" strokeWidth={3} dot={{ fill: '#F87171', strokeWidth: 2 }} name="Pengeluaran" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart - Pengeluaran per Kategori */}
          <div
            className="rounded-xl p-6"
            style={{
              background: 'linear-gradient(145deg, #2D1B0E 0%, #1A0F0A 100%)',
              border: '1px solid rgba(218, 165, 32, 0.2)'
            }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: 'Cinzel, serif', color: '#DAA520' }}>
              <Crown size={20} />
              Distribusi Pengeluaran
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.pieData || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {(data?.pieData || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(218, 165, 32, 0.3)" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontFamily: 'Cinzel, serif' }}
                    formatter={(value) => <span style={{ color: '#F5DEB3' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bar Chart - Perbandingan Iuran - Wayang Style */}
        <div
          className="rounded-xl p-6"
          style={{
            background: 'linear-gradient(145deg, #2D1B0E 0%, #1A0F0A 100%)',
            border: '1px solid rgba(218, 165, 32, 0.2)'
          }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: 'Cinzel, serif', color: '#DAA520' }}>
            <DollarSign size={20} />
            Perbandingan Jenis Iuran
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.barData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(218, 165, 32, 0.1)" />
                <XAxis dataKey="name" stroke="#F5DEB3" fontSize={12} style={{ fontFamily: 'Cinzel, serif' }} />
                <YAxis stroke="#F5DEB3" fontSize={12} tickFormatter={(value) => `${value / 1000}K`} style={{ fontFamily: 'Cinzel, serif' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#DAA520" radius={[4, 4, 0, 0]} name="Jumlah" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transaksi Table - Wayang Style */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #2D1B0E 0%, #1A0F0A 100%)',
            border: '1px solid rgba(218, 165, 32, 0.2)'
          }}
        >
          <div className="p-6" style={{ borderBottom: '1px solid rgba(218, 165, 32, 0.2)' }}>
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{ fontFamily: 'Cinzel, serif', color: '#DAA520' }}>
              <Scroll size={20} />
              Daftar Transaksi
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'rgba(218, 165, 32, 0.1)' }}>
                  <th className="text-left py-4 px-4 text-sm font-medium" style={{ color: '#DAA520' }}>Tanggal</th>
                  <th className="text-left py-4 px-4 text-sm font-medium" style={{ color: '#DAA520' }}>Keterangan</th>
                  <th className="text-left py-4 px-4 text-sm font-medium" style={{ color: '#DAA520' }}>Kategori</th>
                  <th className="text-left py-4 px-4 text-sm font-medium" style={{ color: '#DAA520' }}>Jenis</th>
                  <th className="text-right py-4 px-4 text-sm font-medium" style={{ color: '#DAA520' }}>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {(data?.transaksi || []).map((t) => (
                  <tr
                    key={t.id}
                    style={{ borderBottom: '1px solid rgba(218, 165, 32, 0.1)' }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-4 text-sm" style={{ color: '#F5DEB3', opacity: 0.7 }}>
                      {new Date(t.tanggal).toLocaleDateString('id-ID')}
                    </td>
                    <td className="py-4 px-4 text-sm" style={{ color: '#F5DEB3' }}>
                      {t.namaWarga ? `${t.namaWarga} - ` : ''}{t.keterangan}
                    </td>
                    <td className="py-4 px-4 text-sm" style={{ color: '#F5DEB3', opacity: 0.7 }}>{t.kategori}</td>
                    <td className="py-4 px-4">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: t.jenis === 'Pemasukan' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(220, 38, 38, 0.2)',
                          color: t.jenis === 'Pemasukan' ? '#4ADE80' : '#F87171',
                          border: `1px solid ${t.jenis === 'Pemasukan' ? '#22c55e' : '#ef4444'}`
                        }}
                      >
                        {t.jenis}
                      </span>
                    </td>
                    <td
                      className="py-4 px-4 text-sm font-semibold text-right"
                      style={{ fontFamily: 'Cinzel, serif', color: t.jenis === 'Pemasukan' ? '#4ADE80' : '#F87171' }}
                    >
                      {t.jenis === 'Pemasukan' ? '+' : '-'}{formatCurrency(t.jumlah)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(data?.transaksi || []).length === 0 && (
            <div className="py-12 text-center">
              <Scroll size={48} style={{ color: '#DAA520', opacity: 0.3, margin: '0 auto 16px' }} />
              <p style={{ color: '#F5DEB3', opacity: 0.5 }}>Tidak ada transaksi yang ditemukan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
