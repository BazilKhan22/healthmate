import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: '/dashboard', label: '🏠 Dashboard' },
    { to: '/reports', label: '📋 Reports' },
    { to: '/vitals', label: '❤️ Vitals' },
    { to: '/health-tips', label: '💡 Health Tips' },
    { to: '/reminders', label: '🔔 Reminders' },
    { to: '/settings', label: '⚙️ Settings' },
    { to: '/health-blog', label: '📚 Blog' },
  ];

  return (
    <>
      <nav style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        borderBottom: '1px solid rgba(226,232,240,0.8)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: '800', color: '#6366f1', textDecoration: 'none' }}>
          🏥 HealthMate
          <span style={{ fontSize: '11px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' }}>
            Premium
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }} className="desktop-nav">
          {navItems.map(item => (
            <Link key={item.to} to={item.to} style={{
              color: location.pathname === item.to ? 'white' : '#64748b',
              textDecoration: 'none',
              padding: '7px 13px',
              borderRadius: '9px',
              fontWeight: '500',
              fontSize: '0.85rem',
              background: location.pathname === item.to ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent',
              boxShadow: location.pathname === item.to ? '0 2px 8px rgba(99,102,241,0.3)' : 'none',
              transition: 'all 0.2s ease',
            }}>
              {item.label.split(' ')[1]}
            </Link>
          ))}
        </div>

        {/* Desktop User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="desktop-user">
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span style={{ color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>{user?.name}</span>
          <button onClick={logout} style={{ padding: '7px 14px', border: '1.5px solid #e2e8f0', borderRadius: '9px', background: 'transparent', cursor: 'pointer', fontWeight: '600', fontSize: '13px', color: '#64748b' }}>
            Logout
          </button>
        </div>

        {/* Hamburger */}
        <button onClick={() => setDrawerOpen(true)} className="hamburger-btn"
          style={{ display: 'none', flexDirection: 'column', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}>
          <span style={{ width: '22px', height: '2px', background: '#374151', borderRadius: '2px', display: 'block' }} />
          <span style={{ width: '22px', height: '2px', background: '#374151', borderRadius: '2px', display: 'block' }} />
          <span style={{ width: '22px', height: '2px', background: '#374151', borderRadius: '2px', display: 'block' }} />
        </button>
      </nav>

      {/* Overlay */}
      {drawerOpen && (
        <div onClick={() => setDrawerOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, backdropFilter: 'blur(2px)' }} />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '280px',
        background: 'white', zIndex: 300,
        transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Drawer Header */}
        <div style={{ padding: '20px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: 'white', fontWeight: '800', fontSize: '1.1rem' }}>🏥 HealthMate</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', marginTop: '2px' }}>{user?.name}</div>
          </div>
          <button onClick={() => setDrawerOpen(false)}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ✕
          </button>
        </div>

        {/* Drawer Links */}
        <div style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
          {navItems.map(item => (
            <Link key={item.to} to={item.to} onClick={() => setDrawerOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '13px 16px', borderRadius: '12px', textDecoration: 'none',
              fontWeight: '500', fontSize: '0.95rem', marginBottom: '4px',
              color: location.pathname === item.to ? '#6366f1' : '#374151',
              background: location.pathname === item.to ? 'rgba(99,102,241,0.08)' : 'transparent',
              borderLeft: location.pathname === item.to ? '3px solid #6366f1' : '3px solid transparent',
              transition: 'all 0.2s ease',
            }}>
              <span style={{ fontSize: '18px' }}>{item.label.split(' ')[0]}</span>
              <span>{item.label.split(' ').slice(1).join(' ')}</span>
            </Link>
          ))}
        </div>

        {/* Drawer Footer */}
        <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '14px', color: '#0f172a' }}>{user?.name}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Premium Member</div>
            </div>
          </div>
          <button onClick={logout} style={{ width: '100%', padding: '11px', background: 'linear-gradient(135deg,#ef4444,#dc2626)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
            🚪 Logout
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-user { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;