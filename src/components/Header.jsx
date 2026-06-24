import { Bell, User, LogOut, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useState } from 'react';

export default function Header({ title }) {
  const { user, getStatistikRealtime } = useApp();
  const [showProfile, setShowProfile] = useState(false);
  const stats = getStatistikRealtime();

  return (
    <header
      className="px-4 lg:px-8 py-4 sticky top-0 z-30"
      style={{
        background: 'linear-gradient(180deg, #2D1B0E 0%, #1A0F0A 100%)',
        borderBottom: '2px solid rgba(218, 165, 32, 0.3)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
      }}
    >
      <div className="flex items-center justify-between">
        {/* Title with Wayang Style */}
        <div className="ml-12 lg:ml-0">
          <h2
            className="text-2xl font-bold tracking-wide"
            style={{ fontFamily: 'Cinzel, serif', color: '#DAA520' }}
          >
            {title}
          </h2>
          <p className="text-sm mt-1" style={{ color: '#F5DEB3', opacity: 0.7 }}>
            {new Date().toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notification Badge */}
          {stats.tagihanBelumBayar > 0 && (
            <div className="relative">
              <Bell
                className="cursor-pointer transition-all hover:scale-110"
                style={{ color: '#DAA520' }}
                size={24}
              />
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold animate-pulse"
                style={{ backgroundColor: '#8B0000', color: '#DAA520' }}
              >
                {stats.tagihanBelumBayar > 9 ? '9+' : stats.tagihanBelumBayar}
              </span>
            </div>
          )}

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 p-2 rounded-lg transition-all"
              style={{
                background: showProfile ? 'rgba(218, 165, 32, 0.1)' : 'transparent',
                border: showProfile ? '1px solid rgba(218, 165, 32, 0.3)' : '1px solid transparent'
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #8B0000 0%, #5C0000 100%)',
                  border: '2px solid #DAA520',
                  boxShadow: '0 0 10px rgba(218, 165, 32, 0.3)'
                }}
              >
                <User className="style={{ color: '#DAA520' }}" size={20} style={{ color: '#DAA520' }} />
              </div>
              <div className="hidden md:block text-left">
                <p className="font-medium" style={{ color: '#F5DEB3' }}>{user.nama}</p>
                <p className="text-xs" style={{ color: '#DAA520' }}>Panitia Iuran</p>
              </div>
            </button>

            {/* Dropdown with Wayang Style */}
            {showProfile && (
              <div
                className="absolute right-0 top-full mt-2 w-72 rounded-xl overflow-hidden z-50"
                style={{
                  background: 'linear-gradient(145deg, #2D1B0E 0%, #1A0F0A 100%)',
                  border: '1px solid rgba(218, 165, 32, 0.3)',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(218, 165, 32, 0.1)'
                }}
              >
                {/* Profile Header */}
                <div
                  className="p-4"
                  style={{
                    background: 'linear-gradient(90deg, rgba(139, 0, 0, 0.3) 0%, transparent 100%)',
                    borderBottom: '1px solid rgba(218, 165, 32, 0.2)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, #8B0000 0%, #5C0000 100%)',
                        border: '2px solid #DAA520'
                      }}
                    >
                      <Shield size={24} style={{ color: '#DAA520' }} />
                    </div>
                    <div>
                      <p className="font-semibold" style={{ fontFamily: 'Cinzel, serif', color: '#DAA520' }}>
                        {user.nama}
                      </p>
                      <p className="text-xs" style={{ color: '#F5DEB3', opacity: 0.7 }}>{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
                    style={{ color: '#F5DEB3' }}
                  >
                    <User size={18} style={{ color: '#DAA520' }} />
                    <span>Profil Saya</span>
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
                    style={{ color: '#ef4444' }}
                  >
                    <LogOut size={18} />
                    <span>Keluar</span>
                  </button>
                </div>

                {/* Footer Decoration */}
                <div
                  className="px-4 py-2 text-center"
                  style={{ borderTop: '1px solid rgba(218, 165, 32, 0.2)' }}
                >
                  <span className="text-xs" style={{ color: '#DAA520', opacity: 0.5 }}>
                    ⚔ Ksatria Arjuna ⚔
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
