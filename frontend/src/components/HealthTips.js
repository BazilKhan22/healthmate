import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HealthTips = () => {
  const { user, logout } = useAuth();
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [savedTips, setSavedTips] = useState([]);

  // Sample health tips data
  const allTips = [
    {
      id: 1,
      category: 'diet',
      title: '🥗 Stay Hydrated',
      tip: 'Drink at least 8 glasses of water daily. Carry a water bottle to track your intake.',
      icon: '💧',
      color: '#2563eb'
    },
    {
      id: 2,
      category: 'diet',
      title: '🍎 Eat Rainbow',
      tip: 'Include colorful fruits and vegetables in your diet for essential vitamins and minerals.',
      icon: '🌈',
      color: '#10b981'
    },
    {
      id: 3,
      category: 'exercise',
      title: '🚶 Daily Walk',
      tip: 'Aim for 30 minutes of walking daily. It improves heart health and mood.',
      icon: '👟',
      color: '#f59e0b'
    },
    {
      id: 4,
      category: 'exercise',
      title: '🧘 Stretching',
      tip: 'Take 5-minute stretching breaks every hour if you sit for long periods.',
      icon: '🤸',
      color: '#8b5cf6'
    },
    {
      id: 5,
      category: 'mental',
      title: '🧠 Deep Breathing',
      tip: 'Practice 5 minutes of deep breathing daily to reduce stress and anxiety.',
      icon: '🌬️',
      color: '#ec4899'
    },
    {
      id: 6,
      category: 'mental',
      title: '😴 Quality Sleep',
      tip: 'Get 7-8 hours of sleep. Maintain a consistent sleep schedule.',
      icon: '🛌',
      color: '#6366f1'
    },
    {
      id: 7,
      category: 'prevention',
      title: '🩺 Regular Checkups',
      tip: 'Schedule annual health checkups. Early detection saves lives.',
      icon: '🏥',
      color: '#14b8a6'
    },
    {
      id: 8,
      category: 'prevention',
      title: '💉 Vaccinations',
      tip: 'Stay updated with vaccinations. Protect yourself and others.',
      icon: '💊',
      color: '#f43f5e'
    },
    {
      id: 9,
      category: 'diet',
      title: '🥑 Healthy Fats',
      tip: 'Include avocados, nuts, and olive oil for heart-healthy fats.',
      icon: '🥑',
      color: '#84cc16'
    },
    {
      id: 10,
      category: 'exercise',
      title: '💪 Strength Training',
      tip: 'Do strength exercises twice a week to maintain muscle mass.',
      icon: '🏋️',
      color: '#d946ef'
    },
    {
      id: 11,
      category: 'mental',
      title: '📝 Journaling',
      tip: 'Write down 3 things you\'re grateful for daily to boost mental health.',
      icon: '📔',
      color: '#f97316'
    },
    {
      id: 12,
      category: 'prevention',
      title: '🧴 Sun Protection',
      tip: 'Use sunscreen daily, even on cloudy days. Protect your skin.',
      icon: '☀️',
      color: '#eab308'
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setTips(allTips);
      setLoading(false);
    }, 1000);

    // Load saved tips from localStorage
    const saved = localStorage.getItem('savedTips');
    if (saved) {
      setSavedTips(JSON.parse(saved));
    }
  }, []);

  const filteredTips = category === 'all' 
    ? tips 
    : tips.filter(tip => tip.category === category);

  const saveTip = (tip) => {
    let updatedSaved;
    if (savedTips.includes(tip.id)) {
      updatedSaved = savedTips.filter(id => id !== tip.id);
    } else {
      updatedSaved = [...savedTips, tip.id];
    }
    setSavedTips(updatedSaved);
    localStorage.setItem('savedTips', JSON.stringify(updatedSaved));
  };

  const shareTip = (tip) => {
    if (navigator.share) {
      navigator.share({
        title: tip.title,
        text: tip.tip,
        url: window.location.href,
      });
    } else {
      alert('Share this tip: ' + tip.tip);
    }
  };

  const categories = [
    { id: 'all', name: 'All Tips', icon: '📋' },
    { id: 'diet', name: 'Diet & Nutrition', icon: '🥗' },
    { id: 'exercise', name: 'Exercise & Fitness', icon: '🏃' },
    { id: 'mental', name: 'Mental Health', icon: '🧠' },
    { id: 'prevention', name: 'Prevention', icon: '🛡️' },
  ];

  return (
    <div>
      <nav className="navbar">
        <Link to="/dashboard" className="nav-brand">
          🏥 <span style={{ fontWeight: 700 }}>HealthMate</span>
        </Link>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/reports" className="nav-link">Reports</Link>
          <Link to="/vitals" className="nav-link">Vitals</Link>
          <Link to="/health-tips" className="nav-link active">Health Tips</Link>
          <Link to="/reminders" className="nav-link">Reminders</Link>
        </div>
        <div className="user-menu">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '15px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="user-greeting">{user?.name}</span>
          </div>
          <button onClick={logout} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '14px' }}>
            Logout
          </button>
        </div>
      </nav>

      <div className="reports-container">
        {/* Header */}
        <div className="reports-header">
          <div>
            <h1 className="dashboard-title">Health Tips & Wellness</h1>
            <p className="dashboard-subtitle">Daily tips for a healthier lifestyle</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-outline">
              📌 Saved ({savedTips.length})
            </button>
            <button className="btn btn-primary">
              🔔 Subscribe
            </button>
          </div>
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              style={{
                padding: '10px 20px',
                background: category === cat.id ? '#2563eb' : 'white',
                color: category === cat.id ? 'white' : '#374151',
                border: '1px solid #e2e8f0',
                borderRadius: '30px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Tips Grid */}
        {loading ? (
          <div className="loading-screen">
            <div className="spinner"></div>
            <p>Loading health tips...</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
            gap: '20px' 
          }}>
            {filteredTips.map(tip => (
              <div 
                key={tip.id} 
                className="report-card fade-in"
                style={{ 
                  borderLeft: `4px solid ${tip.color}`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Background Icon */}
                <div style={{
                  position: 'absolute',
                  right: '10px',
                  bottom: '10px',
                  fontSize: '60px',
                  opacity: '0.1',
                  color: tip.color
                }}>
                  {tip.icon}
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div className="report-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: `${tip.color}20`,
                        color: tip.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px'
                      }}>
                        {tip.icon}
                      </div>
                      <h3 className="report-title" style={{ margin: 0 }}>{tip.title}</h3>
                    </div>
                    <div className="report-actions">
                      <button 
                        onClick={() => saveTip(tip)}
                        className="btn btn-outline"
                        style={{ 
                          padding: '6px 12px', 
                          fontSize: '12px',
                          color: savedTips.includes(tip.id) ? '#10b981' : '#64748b'
                        }}
                      >
                        {savedTips.includes(tip.id) ? '✅ Saved' : '📌 Save'}
                      </button>
                      <button 
                        onClick={() => shareTip(tip)}
                        className="btn btn-outline"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        📤 Share
                      </button>
                    </div>
                  </div>

                  <div className="report-summary">
                    <p style={{ 
                      fontSize: '14px', 
                      lineHeight: '1.6',
                      color: '#4b5563',
                      marginBottom: '15px'
                    }}>
                      {tip.tip}
                    </p>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '15px'
                    }}>
                      <span style={{
                        padding: '4px 10px',
                        background: '#f3f4f6',
                        borderRadius: '20px',
                        fontSize: '11px',
                        color: '#6b7280',
                        textTransform: 'uppercase'
                      }}>
                        {tip.category}
                      </span>
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                        Daily Tip #{tip.id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Daily Quote Section */}
        <div className="chart-card fade-in" style={{ marginTop: '30px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <h3 style={{ marginBottom: '10px', fontSize: '24px' }}>✨ Daily Health Wisdom</h3>
            <p style={{ fontSize: '18px', fontStyle: 'italic', marginBottom: '15px' }}>
              "The greatest wealth is health. Take care of your body, it's the only place you have to live."
            </p>
            <p style={{ opacity: 0.8 }}>— Virgil</p>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="chart-card fade-in" style={{ marginTop: '30px' }}>
          <div className="chart-header">
            <h3 className="chart-title">📧 Get Daily Health Tips</h3>
          </div>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>
              Subscribe to receive daily health tips directly in your inbox
            </p>
            <div style={{ display: 'flex', gap: '10px', maxWidth: '400px', margin: '0 auto' }}>
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <button className="btn btn-primary" style={{ width: 'auto' }}>
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthTips;