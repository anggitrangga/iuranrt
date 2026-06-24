import { useState } from 'react';
import { CreditCard, Banknote, Smartphone, CheckCircle, AlertCircle, Crown, Sword } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function BayarTagihan() {
  const { user, getTagihanUser, bayarTagihan } = useApp();
  const myTagihan = getTagihanUser(user.id);
  const tagihanBelumBayar = myTagihan.filter(t => t.status === 'belum_bayar' || t.status === 'terlambat');
  const [selectedTagihan, setSelectedTagihan] = useState(null);
  const [metodeBayar, setMetodeBayar] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const handleBayar = () => {
    if (selectedTagihan && metodeBayar) {
      setShowConfirmation(false);
      setShowSuccess(true);
      setTimeout(() => {
        bayarTagihan(selectedTagihan.id, metodeBayar);
        setShowSuccess(false);
        setSelectedTagihan(null);
        setMetodeBayar('');
      }, 2000);
    }
  };

  const totalBelumBayar = tagihanBelumBayar.reduce((sum, t) => sum + t.jumlah, 0);

  const metodeBayarOptions = [
    { id: 'Transfer Bank', label: 'Transfer Bank', icon: Banknote, desc: 'BCA, Mandiri, BNI, BRI' },
    { id: 'E-Wallet', label: 'E-Wallet', icon: Smartphone, desc: 'GoPay, OVO, Dana' },
    { id: 'Tunai', label: 'Bayar Tunai', icon: CreditCard, desc: 'Bayar langsung ke Bendahara' },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Bayar Tagihan" />

      <div className="flex-1 p-4 lg:p-8 space-y-6" style={{ background: '#1A0F0A', minHeight: '100%' }}>
        {/* Summary Card - Wayang Style */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'linear-gradient(135deg, #8B0000 0%, #5C0000 50%, #2D1B0E 100%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4), inset 0 0 60px rgba(218, 165, 32, 0.1)'
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Crown size={20} style={{ color: '#DAA520' }} />
                <span className="text-sm uppercase tracking-wider" style={{ color: '#DAA520', fontFamily: 'Cinzel, serif' }}>
                  Kewajiban Kas RT
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-1" style={{ color: '#F5DEB3' }}>
                Tagihan Anda
              </h3>
              <p style={{ color: '#F5DEB3', opacity: 0.7 }}>
                {tagihanBelumBayar.length} prasasti kewajiban belum diselesaikan
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-sm" style={{ color: '#F5DEB3', opacity: 0.6 }}>Total Kewajiban</p>
              <p className="text-3xl font-bold" style={{ fontFamily: 'Cinzel, serif', color: '#F87171' }}>
                {formatCurrency(totalBelumBayar)}
              </p>
            </div>
          </div>
        </div>

        {/* Tagihan List - Wayang Style */}
        {tagihanBelumBayar.length > 0 ? (
          <div className="grid gap-4">
            {tagihanBelumBayar.map((t) => (
              <div
                key={t.id}
                className="rounded-xl p-5 transition-all cursor-pointer"
                style={{
                  background: 'linear-gradient(145deg, #2D1B0E 0%, #1A0F0A 100%)',
                  border: selectedTagihan?.id === t.id ? '2px solid #DAA520' : '1px solid rgba(218, 165, 32, 0.2)',
                  boxShadow: selectedTagihan?.id === t.id
                    ? '0 0 20px rgba(218, 165, 32, 0.2)'
                    : '0 4px 15px rgba(0,0,0,0.2)'
                }}
                onClick={() => setSelectedTagihan(t)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        background: t.status === 'terlambat' ? 'rgba(220, 38, 38, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                        border: `1px solid ${t.status === 'terlambat' ? 'rgba(220, 38, 38, 0.5)' : 'rgba(234, 179, 8, 0.5)'}`
                      }}
                    >
                      {t.status === 'terlambat' ? (
                        <AlertCircle size={24} style={{ color: '#F87171' }} />
                      ) : (
                        <CreditCard size={24} style={{ color: '#FACC15' }} />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold" style={{ fontFamily: 'Cinzel, serif', color: '#F5DEB3' }}>{t.jenis}</h4>
                      <p className="text-sm" style={{ color: '#F5DEB3', opacity: 0.6 }}>{t.bulan}</p>
                      <p className="text-xs" style={{ color: '#F87171', opacity: 0.8 }}>
                        Jatuh Tempo: {new Date(t.tanggalJatuhTempo).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold" style={{ fontFamily: 'Cinzel, serif', color: '#DAA520' }}>
                      {formatCurrency(t.jumlah)}
                    </p>
                    {getStatusBadge(t.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="rounded-xl p-12 text-center"
            style={{
              background: 'linear-gradient(145deg, #2D1B0E 0%, #1A0F0A 100%)',
              border: '1px solid rgba(218, 165, 32, 0.2)'
            }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                background: 'rgba(34, 197, 94, 0.2)',
                border: '2px solid rgba(34, 197, 94, 0.5)'
              }}
            >
              <Crown size={40} style={{ color: '#4ADE80' }} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Cinzel, serif', color: '#4ADE80' }}>
              Semua Kewajiban Telah Lunas!
            </h3>
            <p style={{ color: '#F5DEB3', opacity: 0.6 }}>Anda adalah ksatria yang bertanggung jawab.</p>
          </div>
        )}

        {/* Payment Method Selection - Wayang Style */}
        {selectedTagihan && (
          <div
            className="rounded-xl p-6"
            style={{
              background: 'linear-gradient(145deg, #2D1B0E 0%, #1A0F0A 100%)',
              border: '1px solid rgba(218, 165, 32, 0.2)'
            }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: 'Cinzel, serif', color: '#DAA520' }}>
              <Sword size={20} />
              Pilih Jalur Pembayaran
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {metodeBayarOptions.map((metode) => (
                <button
                  key={metode.id}
                  onClick={() => setMetodeBayar(metode.id)}
                  className="p-4 rounded-xl border-2 transition-all text-left"
                  style={{
                    background: metodeBayar === metode.id ? 'rgba(218, 165, 32, 0.2)' : 'rgba(0,0,0,0.2)',
                    borderColor: metodeBayar === metode.id ? '#DAA520' : 'rgba(218, 165, 32, 0.2)',
                    color: metodeBayar === metode.id ? '#DAA520' : '#F5DEB3'
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background: metodeBayar === metode.id ? '#DAA520' : 'rgba(218, 165, 32, 0.2)',
                        color: metodeBayar === metode.id ? '#1A0F0A' : '#DAA520'
                      }}
                    >
                      <metode.icon size={20} />
                    </div>
                    <span className="font-medium" style={{ fontFamily: 'Cinzel, serif' }}>{metode.label}</span>
                  </div>
                  <p className="text-xs" style={{ opacity: 0.6 }}>{metode.desc}</p>
                </button>
              ))}
            </div>

            {metodeBayar && (
              <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(218, 165, 32, 0.2)' }}>
                <div className="flex items-center justify-between mb-4">
                  <span style={{ color: '#F5DEB3', opacity: 0.7 }}>Tagihan</span>
                  <span style={{ fontFamily: 'Cinzel, serif', color: '#F5DEB3' }}>{selectedTagihan.jenis} {selectedTagihan.bulan}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span style={{ color: '#F5DEB3', opacity: 0.7 }}>Metode Bayar</span>
                  <span style={{ fontFamily: 'Cinzel, serif', color: '#F5DEB3' }}>{metodeBayar}</span>
                </div>
                <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(218, 165, 32, 0.2)' }}>
                  <span className="text-lg font-semibold" style={{ fontFamily: 'Cinzel, serif', color: '#F5DEB3' }}>Total Bayar</span>
                  <span className="text-2xl font-bold" style={{ fontFamily: 'Cinzel, serif', color: '#DAA520' }}>
                    {formatCurrency(selectedTagihan.jumlah)}
                  </span>
                </div>
                <button
                  onClick={() => setShowConfirmation(true)}
                  className="w-full mt-6 py-4 font-semibold rounded-xl transition-all"
                  style={{
                    background: 'linear-gradient(90deg, #8B0000 0%, #5C0000 100%)',
                    border: '2px solid #DAA520',
                    color: '#DAA520',
                    fontFamily: 'Cinzel, serif',
                    boxShadow: '0 0 20px rgba(218, 165, 32, 0.2)'
                  }}
                >
                  ⚔ Bayar Sekarang
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal - Wayang Style */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div
            className="rounded-2xl w-full max-w-md overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #2D1B0E 0%, #1A0F0A 100%)',
              border: '2px solid rgba(218, 165, 32, 0.3)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(218, 165, 32, 0.1)'
            }}
          >
            <div className="p-6 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  background: 'rgba(218, 165, 32, 0.2)',
                  border: '2px solid #DAA520'
                }}
              >
                <Sword size={32} style={{ color: '#DAA520' }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Cinzel, serif', color: '#DAA520' }}>
                Konfirmasi Pembayaran
              </h3>
              <p className="mb-6" style={{ color: '#F5DEB3', opacity: 0.7 }}>
                Anda akan menyelesaikan prasasti{' '}
                <span style={{ color: '#F5DEB3' }}>{selectedTagihan.jenis} {selectedTagihan.bulan}</span>{' '}
                sebesar{' '}
                <span className="font-bold" style={{ color: '#DAA520' }}>{formatCurrency(selectedTagihan.jumlah)}</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 py-3 font-medium rounded-xl transition-all"
                  style={{
                    backgroundColor: 'rgba(218, 165, 32, 0.2)',
                    color: '#DAA520',
                    border: '1px solid rgba(218, 165, 32, 0.3)'
                  }}
                >
                  Batal
                </button>
                <button
                  onClick={handleBayar}
                  className="flex-1 py-3 font-medium rounded-xl transition-all"
                  style={{
                    background: 'linear-gradient(90deg, #8B0000 0%, #5C0000 100%)',
                    color: '#DAA520',
                    border: '1px solid #DAA520'
                  }}
                >
                  Konfirmasi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal - Wayang Style */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div
            className="rounded-2xl w-full max-w-md p-8 text-center"
            style={{
              background: 'linear-gradient(145deg, #2D1B0E 0%, #1A0F0A 100%)',
              border: '2px solid #DAA520',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(218, 165, 32, 0.3)'
            }}
          >
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce"
              style={{
                background: 'rgba(34, 197, 94, 0.2)',
                border: '3px solid #4ADE80'
              }}
            >
              <CheckCircle size={56} style={{ color: '#4ADE80' }} />
            </div>
            <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Cinzel, serif', color: '#4ADE80' }}>
              Pembayaran Berhasil!
            </h3>
            <p style={{ color: '#F5DEB3', opacity: 0.7 }}>
              Anda telah menyelesaikan kewajiban dengan kehormatan. Terima kasih, Ksatria!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
