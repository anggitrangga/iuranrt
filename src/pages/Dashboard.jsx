import { Users, Receipt, DollarSign, AlertCircle, TrendingUp, TrendingDown, Clock, Crown, Sword, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, getStatistikRealtime, getTagihanUser, tagihan, loading, fetchData } = useApp();
  const stats = getStatistikRealtime();
  const myTagihan = getTagihanUser(user?.id);
  const tagihanBelumBayar = myTagihan.filter(t => t.status === 'belum_bayar' || t.status === 'terlambat');
  const totalBelumBayar = tagihanBelumBayar.reduce((sum, t) => sum + t.jumlah, 0);

  // Recent transactions (last 5 lunas)
  const recentTransactions = [...tagihan]
    .filter(t => t.status === 'lunas')
    .slice(0, 5);

  const statCards = [
    {
      label: 'Total Warga',
      value: stats.totalWarga,
      icon: Users,
      bgColor: 'rgba(59, 130, 246, 0.2)',
      textColor: '#60A5FA',
      borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    {
      label: 'Tagihan Bulan Ini',
      value: stats.tagihanBulanIni,
      icon: Receipt,
      bgColor: 'rgba(168, 85, 247, 0.2)',
      textColor: '#C084FC',
      borderColor: 'rgba(168, 85, 247, 0.3)',
    },
    {
      label: 'Sudah Bayar',
      value: stats.tagihanLunas,
      icon: DollarSign,
      bgColor: 'rgba(34, 197, 94, 0.2)',
      textColor: '#4ADE80',
      borderColor: 'rgba(34, 197, 94, 0.3)',
    },
    {
      label: 'Belum Bayar',
      value: stats.tagihanBelumBayar,
      icon: AlertCircle,
      bgColor: 'rgba(220, 38, 38, 0.2)',
      textColor: '#F87171',
      borderColor: 'rgba(220, 38, 38, 0.3)',
    },
  ];

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
        style={{ backgroundColor: styles[status]?.bg, color: styles[status]?.color, border: styles[status]?.border }}
      >
        {labels[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="Dashboard" />
        <div className="flex-1 p-4 lg:p-8 flex items-center justify-center" style={{ background: '#1A0F0A', minHeight: '100%' }}>
          <div className="text-center">
            <RefreshCw size={48} className="animate-spin mx-auto mb-4" style={{ color: '#DAA520' }} />
            <p style={{ color: '#DAA520' }}>Memuat data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Dashboard" />

      <div className="flex-1 p-4 lg:p-8 space-y-6" style={{ background: '#1A0F0A', minHeight: '100%' }}>
        {/* Welcome Section - Wayang Style */}
        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #8B0000 0%, #5C0000 50%, #2D1B0E 100%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4), inset 0 0 60px rgba(218, 165, 32, 0.1)'
          }}
        >
          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
            <Crown size={128} style={{ color: '#DAA520' }} />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sword size={20} style={{ color: '#DAA520' }} />
              <span className="text-sm uppercase tracking-wider" style={{ color: '#DAA520', fontFamily: 'Cinzel, serif' }}>
                Arjuna's Command
              </span>
            </div>
            <h3
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: 'Cinzel, serif', color: '#F5DEB3' }}
            >
              Namaste, {user?.nama || 'User'}!
            </h3>
            <p style={{ color: '#F5DEB3', opacity: 0.8 }}>
              Kelola kas RT dengan kehormatan dan keadilan
            </p>
          </div>

          {/* Decorative line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ background: 'linear-gradient(90deg, transparent, #DAA520, transparent)' }}
          />
        </div>

        {/* Personal Tagihan Summary - Wayang Style */}
        {totalBelumBayar > 0 && (
          <div
            className="rounded-xl p-6"
            style={{
              background: 'linear-gradient(145deg, #2D1B0E 0%, #1A0F0A 100%)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(220, 38, 38, 0.2)',
                    border: '2px solid rgba(220, 38, 38, 0.5)'
                  }}
                >
                  <AlertCircle size={28} style={{ color: '#F87171' }} />
                </div>
                <div>
                  <h4 className="font-semibold" style={{ fontFamily: 'Cinzel, serif', color: '#F5DEB3' }}>
                    Kewajiban Tertunda
                  </h4>
                  <p className="text-sm" style={{ color: '#F5DEB3', opacity: 0.7 }}>
                    {tagihanBelumBayar.length} tagihan belum diselesaikan
                  </p>
                </div>
              </div>
              <div className="text-left md:text-right">
                <p className="text-sm" style={{ color: '#F5DEB3', opacity: 0.5 }}>Total Kewajiban</p>
                <p className="text-2xl font-bold" style={{ color: '#F87171' }}>{formatCurrency(totalBelumBayar)}</p>
              </div>
            </div>
            <Link
              to="/bayar"
              className="mt-4 block w-full py-3 text-center rounded-lg font-medium transition-all text-white"
              style={{
                background: 'linear-gradient(90deg, #8B0000 0%, #5C0000 100%)',
                border: '1px solid #DAA520',
                boxShadow: '0 0 15px rgba(218, 165, 32, 0.2)'
              }}
            >
              🗡️ Bayar Sekarang
            </Link>
          </div>
        )}

        {/* Stats Grid - Wayang Style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="rounded-xl p-5 card-hover"
              style={{
                background: 'linear-gradient(145deg, #2D1B0E 0%, #1A0F0A 100%)',
                border: `1px solid ${stat.borderColor}`,
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  <stat.icon style={{ color: stat.textColor }} size={24} />
                </div>
              </div>
              <p className="text-sm mb-1" style={{ color: '#F5DEB3', opacity: 0.7 }}>{stat.label}</p>
              <p className="text-2xl font-bold" style={{ fontFamily: 'Cinzel, serif', color: stat.textColor }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Financial Summary - Wayang Style */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div
            className="lg:col-span-2 rounded-xl p-6"
            style={{
              background: 'linear-gradient(145deg, #2D1B0E 0%, #1A0F0A 100%)',
              border: '1px solid rgba(218, 165, 32, 0.2)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
          >
            <h4
              className="font-semibold mb-4 flex items-center gap-2"
              style={{ fontFamily: 'Cinzel, serif', color: '#DAA520' }}
            >
              <TrendingUp size={20} />
              Ringkasan Kas Bulan Ini
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div
                className="rounded-xl p-4"
                style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.2)'
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={18} style={{ color: '#4ADE80' }} />
                  <span className="text-sm font-medium" style={{ color: '#4ADE80' }}>Pemasukan</span>
                </div>
                <p className="text-xl font-bold" style={{ color: '#4ADE80' }}>
                  {formatCurrency(stats.totalPemasukanBulanIni)}
                </p>
              </div>
              <div
                className="rounded-xl p-4"
                style={{
                  background: 'rgba(220, 38, 38, 0.1)',
                  border: '1px solid rgba(220, 38, 38, 0.2)'
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown size={18} style={{ color: '#F87171' }} />
                  <span className="text-sm font-medium" style={{ color: '#F87171' }}>Pengeluaran</span>
                </div>
                <p className="text-xl font-bold" style={{ color: '#F87171' }}>
                  {formatCurrency(stats.totalPengeluaranBulanIni)}
                </p>
              </div>
            </div>
            <div
              className="mt-4 pt-4"
              style={{ borderTop: '1px solid rgba(218, 165, 32, 0.2)' }}
            >
              <div className="flex items-center justify-between">
                <span style={{ color: '#F5DEB3', opacity: 0.7 }}>Saldo Kas</span>
                <span
                  className="text-xl font-bold"
                  style={{ fontFamily: 'Cinzel, serif', color: stats.saldo >= 0 ? '#DAA520' : '#F87171' }}
                >
                  {formatCurrency(stats.saldo)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions - Wayang Style */}
          <div
            className="rounded-xl p-6"
            style={{
              background: 'linear-gradient(145deg, #2D1B0E 0%, #1A0F0A 100%)',
              border: '1px solid rgba(218, 165, 32, 0.2)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
          >
            <h4
              className="font-semibold mb-4"
              style={{ fontFamily: 'Cinzel, serif', color: '#DAA520' }}
            >
              Aksi Cepat
            </h4>
            <div className="space-y-3">
              <Link
                to="/bayar"
                className="flex items-center gap-3 p-3 rounded-lg transition-all"
                style={{
                  background: 'rgba(218, 165, 32, 0.1)',
                  border: '1px solid rgba(218, 165, 32, 0.2)'
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(218, 165, 32, 0.2)' }}
                >
                  <Receipt size={20} style={{ color: '#DAA520' }} />
                </div>
                <span style={{ color: '#F5DEB3' }}>Bayar Tagihan</span>
              </Link>
              <Link
                to="/tagihan"
                className="flex items-center gap-3 p-3 rounded-lg transition-all"
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)'
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(59, 130, 246, 0.2)' }}
                >
                  <Clock size={20} style={{ color: '#60A5FA' }} />
                </div>
                <span style={{ color: '#F5DEB3' }}>Lihat Tagihan</span>
              </Link>
              <Link
                to="/laporan"
                className="flex items-center gap-3 p-3 rounded-lg transition-all"
                style={{
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '1px solid rgba(168, 85, 247, 0.2)'
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(168, 85, 247, 0.2)' }}
                >
                  <TrendingUp size={20} style={{ color: '#C084FC' }} />
                </div>
                <span style={{ color: '#F5DEB3' }}>Laporan Keuangan</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Transactions - Wayang Style */}
        <div
          className="rounded-xl p-6"
          style={{
            background: 'linear-gradient(145deg, #2D1B0E 0%, #1A0F0A 100%)',
            border: '1px solid rgba(218, 165, 32, 0.2)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}
        >
          <h4
            className="font-semibold mb-4 flex items-center gap-2"
            style={{ fontFamily: 'Cinzel, serif', color: '#DAA520' }}
          >
            <Crown size={20} />
            Pembayaran Terbaru
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(218, 165, 32, 0.2)' }}>
                  <th className="text-left py-3 px-2 text-sm font-medium" style={{ color: '#F5DEB3', opacity: 0.7 }}>Warga</th>
                  <th className="text-left py-3 px-2 text-sm font-medium" style={{ color: '#F5DEB3', opacity: 0.7 }}>Jenis</th>
                  <th className="text-left py-3 px-2 text-sm font-medium" style={{ color: '#F5DEB3', opacity: 0.7 }}>Jumlah</th>
                  <th className="text-left py-3 px-2 text-sm font-medium" style={{ color: '#F5DEB3', opacity: 0.7 }}>Tanggal Bayar</th>
                  <th className="text-left py-3 px-2 text-sm font-medium" style={{ color: '#F5DEB3', opacity: 0.7 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid rgba(218, 165, 32, 0.1)' }}>
                    <td className="py-3 px-2 text-sm" style={{ color: '#F5DEB3' }}>{t.namaWarga}</td>
                    <td className="py-3 px-2 text-sm" style={{ color: '#F5DEB3', opacity: 0.7 }}>{t.jenis}</td>
                    <td className="py-3 px-2 text-sm font-medium" style={{ color: '#4ADE80' }}>{formatCurrency(t.jumlah)}</td>
                    <td className="py-3 px-2 text-sm" style={{ color: '#F5DEB3', opacity: 0.7 }}>
                      {t.tanggalBayar ? new Date(t.tanggalBayar).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="py-3 px-2">{getStatusBadge(t.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
