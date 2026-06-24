import { NavLink } from 'react-router-dom';
import { Home, Receipt, CreditCard, Users, BarChart3, Menu, X, Crown } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/tagihan', label: 'Daftar Tagihan', icon: Receipt },
  { path: '/bayar', label: 'Bayar Tagihan', icon: CreditCard },
  { path: '/warga', label: 'Daftar Warga', icon: Users },
  { path: '/laporan', label: 'Laporan Keuangan', icon: BarChart3 },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg shadow-lg"
        style={{ backgroundColor: '#8B0000', color: '#DAA520' }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Wayang Mahabharata Theme */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-72 bg-gradient-to-b from-mahabharata-kulit to-mahabharata-hitam
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{
          boxShadow: 'inset -2px 0 10px rgba(218, 165, 32, 0.1), 4px 0 20px rgba(0,0,0,0.5)'
        }}
      >
        {/* Logo with Wayang Style */}
        <div className="p-6 border-b" style={{ borderColor: 'rgba(218, 165, 32, 0.3)' }}>
          <div className="flex items-center gap-4">
            {/* Arjuna Icon */}
            <div className="relative">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #8B0000 0%, #5C0000 100%)',
                  boxShadow: '0 0 20px rgba(218, 165, 32, 0.4), inset 0 0 10px rgba(218, 165, 32, 0.2)'
                }}
              >
                <Crown className="text-mahabharata-gold" size={28} />
              </div>
              {/* Decorative ring */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  border: '2px solid #DAA520',
                  transform: 'scale(1.1)',
                  opacity: 0.5
                }}
              />
            </div>
            <div>
              <h1
                className="font-bold text-xl tracking-wide"
                style={{ fontFamily: 'Cinzel, serif', color: '#DAA520' }}
              >
                IURAN RT
              </h1>
              <p className="text-xs mt-1" style={{ color: '#F5DEB3', opacity: 0.7 }}>
                Sistem Manajemen Kas
              </p>
            </div>
          </div>

          {/* Decorative element */}
          <div className="mt-4 flex items-center justify-center">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, #DAA520, transparent)' }} />
            <span className="mx-3 text-xs" style={{ color: '#DAA520' }}>⚔</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, #DAA520, transparent)' }} />
          </div>
        </div>

        {/* Navigation - Wayang Style */}
        <nav className="p-4 space-y-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-4 px-5 py-4 rounded-lg transition-all relative overflow-hidden
                ${isActive
                  ? 'text-white'
                  : 'text-mahabharata-krem hover:text-white'
                }
              `}
              style={({ isActive }) => ({
                background: isActive
                  ? 'linear-gradient(90deg, rgba(139, 0, 0, 0.8) 0%, rgba(139, 0, 0, 0.4) 100%)'
                  : 'transparent',
                borderLeft: isActive ? '3px solid #DAA520' : '3px solid transparent',
                boxShadow: isActive ? '0 0 15px rgba(218, 165, 32, 0.2)' : 'none',
              })}
            >
              {/* Active indicator */}
              {({ isActive }) => isActive && (
                <div
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ background: 'linear-gradient(180deg, #DAA520, #8B6914)' }}
                />
              )}
              <item.icon
                size={22}
                style={{ color: '#DAA520' }}
              />
              <span
                className="font-medium tracking-wide"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Footer with Wayang Decoration */}
        <div
          className="absolute bottom-0 left-0 right-0 p-4"
          style={{ borderTop: '1px solid rgba(218, 165, 32, 0.2)' }}
        >
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-8" style={{ background: '#DAA520', opacity: 0.5 }} />
            <span style={{ color: '#DAA520', fontSize: '10px' }}>⚔ ARJUNA ⚔</span>
            <div className="h-px w-8" style={{ background: '#DAA520', opacity: 0.5 }} />
          </div>
          <p className="text-center text-xs mt-2" style={{ color: '#F5DEB3', opacity: 0.5 }}>
            &copy; 2026 - Kekayaan Untuk Kemanusiaan
          </p>
        </div>
      </aside>
    </>
  );
}
