import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

// LineChart Component
const LineChart = ({ data, labels, color, title }) => {
  const maxValue = Math.max(...data, 1);
  const minValue = Math.min(...data, 0);
  const range = maxValue - minValue || 1;
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - minValue) / range) * 80;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <h4 style={{ fontSize: '14px', color: '#374151', fontWeight: '600' }}>{title}</h4>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: '#10b981' }}>▲ +12%</span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>vs last week</span>
        </div>
      </div>
      <div style={{ height: '120px', position: 'relative', marginBottom: '20px' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          {[0, 25, 50, 75, 100].map(line => (
            <div key={line} style={{ position: 'absolute', top: `${line}%`, left: 0, right: 0, height: '1px', background: '#e2e8f0', opacity: 0.5 }} />
          ))}
        </div>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline points={points} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <polygon points={`0,100 ${points} 100,100`} fill={color} opacity="0.1" />
        </svg>
        {data.map((value, index) => (
          <div key={index} style={{
            position: 'absolute',
            left: `${(index / (data.length - 1)) * 100}%`,
            bottom: `${((value - minValue) / range) * 80}%`,
            transform: 'translate(-50%, 50%)',
            width: '8px', height: '8px', borderRadius: '50%',
            background: color, border: '2px solid white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s'
          }}
            title={`${value}`}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translate(-50%, 50%) scale(1.5)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translate(-50%, 50%)'}
          />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '10px' }}>
        {labels.map((label, index) => <span key={index}>{label}</span>)}
      </div>
    </div>
  );
};

// PieChart Component
const PieChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativeAngle = 0;
  return (
    <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto' }}>
      <svg viewBox="0 0 32 32" style={{ transform: 'rotate(-90deg)' }}>
        {data.map((item, index) => {
          const angle = (item.value / total) * 360;
          const startAngle = cumulativeAngle;
          const endAngle = cumulativeAngle + angle;
          cumulativeAngle = endAngle;
          const startX = 16 + 14 * Math.cos((startAngle * Math.PI) / 180);
          const startY = 16 + 14 * Math.sin((startAngle * Math.PI) / 180);
          const endX = 16 + 14 * Math.cos((endAngle * Math.PI) / 180);
          const endY = 16 + 14 * Math.sin((endAngle * Math.PI) / 180);
          const largeArcFlag = angle > 180 ? 1 : 0;
          const pathData = [`M 16,16`, `L ${startX},${startY}`, `A 14,14 0 ${largeArcFlag},1 ${endX},${endY}`, `Z`].join(' ');
          return <path key={index} d={pathData} fill={item.color} stroke="white" strokeWidth="0.5" />;
        })}
      </svg>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
        <div style={{ fontSize: '20px', fontWeight: '700', color: '#374151' }}>{total}</div>
        <div style={{ fontSize: '10px', color: '#64748b' }}>Total</div>
      </div>
    </div>
  );
};

// GaugeChart Component
const GaugeChart = ({ value, max, label, color }) => {
  const percentage = (value / max) * 100;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <span style={{ fontSize: '12px', color: '#64748b' }}>{label}</span>
        <span style={{ fontSize: '12px', fontWeight: '600', color }}>{value}/{max}</span>
      </div>
      <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${percentage}%`, height: '100%', background: color, borderRadius: '4px', transition: 'width 0.3s ease' }} />
      </div>
    </div>
  );
};

// Navbar Component with Hamburger Drawer
const Navbar = ({ user, logout }) => {
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
        {/* Brand */}
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

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* User avatar - desktop */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="desktop-user">
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span style={{ color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>{user?.name}</span>
            <button onClick={logout} style={{ padding: '7px 14px', border: '1.5px solid #e2e8f0', borderRadius: '9px', background: 'transparent', cursor: 'pointer', fontWeight: '600', fontSize: '13px', color: '#64748b', transition: 'all 0.2s' }}>
              Logout
            </button>
          </div>

          {/* Hamburger - mobile only */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="hamburger-btn"
            style={{ display: 'none', flexDirection: 'column', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}
          >
            <span style={{ width: '22px', height: '2px', background: '#374151', borderRadius: '2px', display: 'block' }} />
            <span style={{ width: '22px', height: '2px', background: '#374151', borderRadius: '2px', display: 'block' }} />
            <span style={{ width: '22px', height: '2px', background: '#374151', borderRadius: '2px', display: 'block' }} />
          </button>
        </div>
      </nav>

      {/* Drawer Overlay */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, backdropFilter: 'blur(2px)' }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed',
        top: 0, right: 0, bottom: 0,
        width: '280px',
        background: 'white',
        zIndex: 300,
        transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Drawer Header */}
        <div style={{ padding: '20px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: 'white', fontWeight: '800', fontSize: '1.1rem' }}>🏥 HealthMate</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', marginTop: '2px' }}>{user?.name}</div>
          </div>
          <button onClick={() => setDrawerOpen(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ✕
          </button>
        </div>

        {/* Drawer Links */}
        <div style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setDrawerOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '13px 16px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '0.95rem',
                marginBottom: '4px',
                color: location.pathname === item.to ? '#6366f1' : '#374151',
                background: location.pathname === item.to ? 'rgba(99,102,241,0.08)' : 'transparent',
                borderLeft: location.pathname === item.to ? '3px solid #6366f1' : '3px solid transparent',
                transition: 'all 0.2s ease',
              }}
            >
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

      {/* CSS for responsive */}
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

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [reports, setReports] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [healthScore, setHealthScore] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (reports.length > 0 || vitals.length > 0) {
      calculateHealthScore();
      generateActivities();
    }
  }, [reports, vitals]);

  const fetchData = async () => {
    try {
      const [reportsRes, vitalsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/reports`),
        axios.get(`${process.env.REACT_APP_API_URL}/vitals`)
      ]);
      setReports(reportsRes.data);
      setVitals(vitalsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const calculateHealthScore = () => {
    let score = 70;
    if (vitals.length > 0) {
      const lastMonth = vitals.filter(v => new Date(v.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;
      score += Math.min(lastMonth * 2, 15);
    }
    if (reports.length > 0) score += Math.min(reports.length * 3, 15);
    const normalVitals = vitals.filter(v => {
      const bp = v.bloodPressure?.systolic || 0;
      const sugar = v.bloodSugar?.fasting || 0;
      return (bp >= 90 && bp <= 140) && (sugar >= 70 && sugar <= 140);
    }).length;
    if (vitals.length > 0) score += (normalVitals / vitals.length) * 10;
    setHealthScore(Math.min(Math.round(score), 100));
  };

  const generateActivities = () => {
    const activities = [];
    reports.slice(0, 3).forEach(report => {
      activities.push({ id: report._id, type: 'report', title: `Report uploaded: ${report.title}`, date: new Date(report.createdAt).toLocaleDateString(), icon: '📄', color: '#6366f1' });
    });
    vitals.slice(0, 3).forEach(vital => {
      activities.push({ id: vital._id, type: 'vital', title: `Vitals recorded: BP ${vital.bloodPressure?.systolic || '-'}/${vital.bloodPressure?.diastolic || '-'}`, date: new Date(vital.date).toLocaleDateString(), icon: '💓', color: '#10b981' });
    });
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    setRecentActivities(activities.slice(0, 5));
  };

  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  }).reverse();

  const bloodPressureData = vitals.slice(0, 7).map(v => v.bloodPressure?.systolic || 0).reverse();
  const bloodSugarData = vitals.slice(0, 7).map(v => v.bloodSugar?.fasting || 0).reverse();

  const reportTypes = reports.reduce((acc, report) => {
    acc[report.reportType] = (acc[report.reportType] || 0) + 1;
    return acc;
  }, {});

  const pieData = [
    { label: 'Blood Tests', value: reportTypes.blood_test || 0, color: '#6366f1' },
    { label: 'X-Rays', value: reportTypes.xray || 0, color: '#10b981' },
    { label: 'Others', value: (reportTypes.mri || 0) + (reportTypes.ultrasound || 0) + (reportTypes.ecg || 0) + (reportTypes.other || 0), color: '#f59e0b' },
  ].filter(item => item.value > 0);

  const isMobile = window.innerWidth <= 768;

  return (
    <div>
      <Navbar user={user} logout={logout} />

      <div className="dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="dashboard-subtitle">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link to="/reports">
              <button className="btn btn-outline">📤 Upload Report</button>
            </Link>
            <Link to="/vitals">
              <button className="btn btn-primary">➕ Add Vitals</button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card fade-in">
            <div className="stat-header">
              <div className="stat-icon reports">📊</div>
              <span className="stat-trend trend-up">+{reports.length > 0 ? Math.min(reports.length * 10, 100) : 0}%</span>
            </div>
            <div className="stat-title">Total Reports</div>
            <div className="stat-number">{reports.length}</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '5px' }}>
              Last upload: {reports.length > 0 ? new Date(reports[0]?.createdAt).toLocaleDateString() : 'Never'}
            </div>
          </div>

          <div className="stat-card fade-in">
            <div className="stat-header">
              <div className="stat-icon vitals">❤️</div>
              <span className="stat-trend trend-up">+{vitals.length > 0 ? Math.min(Math.floor(vitals.length / 30 * 100), 100) : 0}%</span>
            </div>
            <div className="stat-title">Vitals Tracked</div>
            <div className="stat-number">{vitals.length}</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '5px' }}>
              This month: {vitals.filter(v => new Date(v.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
            </div>
          </div>

          <div className="stat-card fade-in">
            <div className="stat-header">
              <div className="stat-icon health">⭐</div>
              <span className="stat-trend trend-up">{healthScore > 70 ? 'Good' : 'Improving'}</span>
            </div>
            <div className="stat-title">Health Score</div>
            <div className="stat-number">{healthScore}</div>
            <GaugeChart value={healthScore} max={100} label="Overall Health" color={healthScore > 80 ? '#10b981' : healthScore > 60 ? '#f59e0b' : '#ef4444'} />
          </div>

          <div className="stat-card fade-in">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>📅</div>
              <span className="stat-trend trend-up">Active</span>
            </div>
            <div className="stat-title">Days Active</div>
            <div className="stat-number">{Math.min(vitals.length + reports.length, 30)}</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '5px' }}>
              Streak: {Math.min(vitals.filter(v => new Date(v.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length, 7)} days
            </div>
          </div>
        </div>

        {/* Main Grid - responsive */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
          gap: '20px',
          marginTop: '20px'
        }}>
          {/* Left - Charts */}
          <div>
            <div className="chart-card fade-in" style={{ marginBottom: '20px' }}>
              <div className="chart-header">
                <h3 className="chart-title">Blood Pressure Trends</h3>
                <select style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }}>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                </select>
              </div>
              {vitals.length > 0 ? (
                <LineChart data={bloodPressureData} labels={last7Days} color="#6366f1" title="Systolic Blood Pressure (mmHg)" />
              ) : (
                <div className="text-center" style={{ padding: '40px 0', color: '#64748b' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📊</div>
                  <p>No blood pressure data yet.</p>
                </div>
              )}
            </div>

            <div className="chart-card fade-in">
              <div className="chart-header">
                <h3 className="chart-title">Blood Sugar Trends</h3>
              </div>
              {vitals.length > 0 ? (
                <LineChart data={bloodSugarData} labels={last7Days} color="#10b981" title="Fasting Blood Sugar (mg/dL)" />
              ) : (
                <div className="text-center" style={{ padding: '40px 0', color: '#64748b' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📈</div>
                  <p>No blood sugar data yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right - Insights */}
          <div>
            <div className="chart-card fade-in" style={{ marginBottom: '20px' }}>
              <h3 className="chart-title" style={{ marginBottom: '15px' }}>Health Insights</h3>
              {reports.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '14px', color: '#64748b' }}>Report Categories</span>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{reports.length} total</span>
                  </div>
                  {pieData.length > 0 && <PieChart data={pieData} />}
                </div>
              )}
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '15px' }}>Vitals Summary</h4>
              <div style={{ display: 'grid', gap: '15px' }}>
                <GaugeChart value={vitals.filter(v => v.bloodPressure?.systolic).length} max={vitals.length || 1} label="BP Records" color="#6366f1" />
                <GaugeChart value={vitals.filter(v => v.bloodSugar?.fasting).length} max={vitals.length || 1} label="Sugar Records" color="#10b981" />
                <GaugeChart value={vitals.filter(v => v.weight).length} max={vitals.length || 1} label="Weight Records" color="#f59e0b" />
              </div>
            </div>

            <div className="chart-card fade-in">
              <div className="chart-header">
                <h3 className="chart-title">Recent Activity</h3>
                <Link to="/reports" style={{ fontSize: '12px', color: '#6366f1', textDecoration: 'none' }}>View all →</Link>
              </div>
              {recentActivities.length > 0 ? (
                <div style={{ marginTop: '15px' }}>
                  {recentActivities.map((activity, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: index < recentActivities.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${activity.color}15`, color: activity.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                        {activity.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: '500', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{activity.title}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{activity.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center" style={{ padding: '30px 0', color: '#64748b' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📋</div>
                  <p style={{ fontSize: '14px' }}>No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions" style={{ marginTop: '20px' }}>
          <Link to="/reports" className="action-card fade-in">
            <div className="action-icon">📊</div>
            <h3 className="action-title">Upload Report</h3>
            <p className="action-description">Add new medical report with AI analysis</p>
            <span style={{ fontSize: '12px', color: '#6366f1', marginTop: '10px', display: 'block' }}>{reports.length} reports total →</span>
          </Link>
          <Link to="/vitals" className="action-card fade-in">
            <div className="action-icon">❤️</div>
            <h3 className="action-title">Track Vitals</h3>
            <p className="action-description">Record blood pressure, sugar, weight</p>
            <span style={{ fontSize: '12px', color: '#10b981', marginTop: '10px', display: 'block' }}>{vitals.length} records total →</span>
          </Link>
          <Link to="/health-tips" className="action-card fade-in">
            <div className="action-icon">💡</div>
            <h3 className="action-title">Health Tips</h3>
            <p className="action-description">Personalized recommendations for you</p>
            <span style={{ fontSize: '12px', color: '#f59e0b', marginTop: '10px', display: 'block' }}>12 new tips →</span>
          </Link>
          <Link to="/reminders" className="action-card fade-in">
            <div className="action-icon">🔔</div>
            <h3 className="action-title">Reminders</h3>
            <p className="action-description">Set medication & appointment alerts</p>
            <span style={{ fontSize: '12px', color: '#8b5cf6', marginTop: '10px', display: 'block' }}>3 active →</span>
          </Link>
        </div>

        {/* Footer Banner */}
        <div style={{ marginTop: '30px', padding: '24px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '16px', color: 'white', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '8px', fontSize: '1.1rem' }}>💪 Your Health Journey</h3>
          <p style={{ opacity: 0.9, fontSize: '14px' }}>
            You've been tracking your health for {Math.max(Math.floor((new Date() - new Date(user?.createdAt || Date.now())) / (1000 * 60 * 60 * 24)), 1)} days. Keep it up!
          </p>
          <Link to="/progress-report">
            <button style={{ background: 'white', color: '#6366f1', border: 'none', padding: '10px 24px', borderRadius: '10px', marginTop: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
              View Progress Report →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;