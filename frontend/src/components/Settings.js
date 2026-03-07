import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Settings = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Theme state
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  // Profile state - Initialize with user data
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
    gender: user?.gender || 'male',
    bloodGroup: user?.bloodGroup || '',
    height: user?.height || '',
    weight: user?.weight || ''
  });
  
  // Notifications state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    reportUploaded: true,
    vitalReminders: true,
    healthTips: true,
    appointmentReminders: false
  });
  
  // Password state
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // Fetch latest profile on mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Apply theme on load
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Load saved notifications
  useEffect(() => {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/profile`);
      const userData = response.data;
      setProfile({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : '',
        gender: userData.gender || 'male',
        bloodGroup: userData.bloodGroup || '',
        height: userData.height || '',
        weight: userData.weight || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const toggleTheme = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  const handleProfileChange = (e) => {
    setProfile(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleNotificationChange = (e) => {
    setNotifications(prev => {
      const updated = {
        ...prev,
        [e.target.name]: e.target.checked
      };
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const handlePasswordChange = (e) => {
    setPassword(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // 👇 UPDATED SAVE PROFILE FUNCTION
  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/auth/profile`, profile);
      
      // Update AuthContext with new name
      updateUser({ name: profile.name });
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Refresh user data
      await fetchUserProfile();
      
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update profile. Please try again.' 
      });
    }
    setLoading(false);
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    if (password.new !== password.confirm) {
      setMessage({ type: 'error', text: 'New passwords do not match!' });
      return;
    }
    
    if (password.new.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters!' });
      return;
    }
    
    if (!password.current) {
      setMessage({ type: 'error', text: 'Please enter current password!' });
      return;
    }
    
    setLoading(true);
    
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/auth/password`, {
        currentPassword: password.current,
        newPassword: password.new
      });
      
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPassword({ current: '', new: '', confirm: '' });
      
    } catch (error) {
      console.error('Password change error:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to change password. Please check your current password.' 
      });
    }
    setLoading(false);
  };

  const deleteAccount = async () => {
    if (window.confirm('⚠️ Are you sure you want to delete your account? This action CANNOT be undone!\n\nAll your reports, vitals, and data will be permanently deleted.')) {
      
      setLoading(true);
      
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/auth/delete-account`);
        
        // Logout user
        logout();
        
        // Redirect to login
        navigate('/login');
        
      } catch (error) {
        console.error('Account deletion error:', error);
        setMessage({ 
          type: 'error', 
          text: error.response?.data?.message || 'Failed to delete account. Please try again.' 
        });
      }
      setLoading(false);
    }
  };

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
          <Link to="/health-tips" className="nav-link">Health Tips</Link>
          <Link to="/reminders" className="nav-link">Reminders</Link>
          <Link to="/settings" className="nav-link active">⚙️ Settings</Link>
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
        <div className="reports-header">
          <div>
            <h1 className="dashboard-title">Settings</h1>
            <p className="dashboard-subtitle">Manage your account preferences and settings</p>
          </div>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`} style={{ marginBottom: '20px' }}>
            {message.text}
          </div>
        )}

        {/* Settings Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', flexWrap: 'wrap' }}>
          {[
            { id: 'profile', label: '👤 Profile', icon: '👤' },
            { id: 'appearance', label: '🎨 Appearance', icon: '🎨' },
            { id: 'notifications', label: '🔔 Notifications', icon: '🔔' },
            { id: 'security', label: '🔒 Security', icon: '🔒' },
            { id: 'account', label: '⚙️ Account', icon: '⚙️' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 20px',
                background: activeTab === tab.id ? '#2563eb' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#64748b',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="chart-card fade-in">
            <h3 className="chart-title" style={{ marginBottom: '20px' }}>Profile Information</h3>
            
            <form onSubmit={saveProfile}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
                  />
                  <small style={{ fontSize: '11px', color: '#64748b' }}>Email cannot be changed</small>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={profile.dateOfBirth}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={profile.gender}
                    onChange={handleProfileChange}
                    style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '10px' }}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Blood Group</label>
                  <select
                    name="bloodGroup"
                    value={profile.bloodGroup}
                    onChange={handleProfileChange}
                    style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '10px' }}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Height (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={profile.height}
                    onChange={handleProfileChange}
                    placeholder="e.g., 175"
                  />
                </div>
                <div className="form-group">
                  <label>Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={profile.weight}
                    onChange={handleProfileChange}
                    placeholder="e.g., 70"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* Appearance Tab - Only Theme */}
        {activeTab === 'appearance' && (
          <div className="chart-card fade-in">
            <h3 className="chart-title" style={{ marginBottom: '20px' }}>Appearance Settings</h3>
            
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ marginBottom: '15px' }}>Theme Mode</h4>
              <div style={{ display: 'flex', gap: '20px' }}>
                <button
                  type="button"
                  onClick={() => toggleTheme('light')}
                  style={{
                    padding: '20px',
                    border: theme === 'light' ? '3px solid #2563eb' : '2px solid #e2e8f0',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    flex: 1,
                    textAlign: 'center',
                    background: 'white',
                    color: '#1e293b'
                  }}
                >
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>☀️</div>
                  <h4>Light Mode</h4>
                </button>
                
                <button
                  type="button"
                  onClick={() => toggleTheme('dark')}
                  style={{
                    padding: '20px',
                    border: theme === 'dark' ? '3px solid #2563eb' : '2px solid #e2e8f0',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    flex: 1,
                    textAlign: 'center',
                    background: '#1e293b',
                    color: 'white'
                  }}
                >
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>🌙</div>
                  <h4>Dark Mode</h4>
                </button>
              </div>
              <p style={{ marginTop: '10px', fontSize: '12px', color: '#64748b' }}>
                Current theme: <strong>{theme === 'light' ? 'Light Mode ☀️' : 'Dark Mode 🌙'}</strong>
              </p>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="chart-card fade-in">
            <h3 className="chart-title" style={{ marginBottom: '20px' }}>Notification Preferences</h3>
            
            <div style={{ display: 'grid', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="emailNotifications"
                  name="emailNotifications"
                  checked={notifications.emailNotifications}
                  onChange={handleNotificationChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="emailNotifications">Enable Email Notifications</label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="reportUploaded"
                  name="reportUploaded"
                  checked={notifications.reportUploaded}
                  onChange={handleNotificationChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="reportUploaded">Report Upload Confirmation</label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="vitalReminders"
                  name="vitalReminders"
                  checked={notifications.vitalReminders}
                  onChange={handleNotificationChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="vitalReminders">Vital Tracking Reminders</label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="healthTips"
                  name="healthTips"
                  checked={notifications.healthTips}
                  onChange={handleNotificationChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="healthTips">Daily Health Tips</label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="appointmentReminders"
                  name="appointmentReminders"
                  checked={notifications.appointmentReminders}
                  onChange={handleNotificationChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="appointmentReminders">Appointment Reminders</label>
              </div>
            </div>

            <p style={{ marginTop: '15px', fontSize: '12px', color: '#10b981' }}>
              ✅ Preferences saved automatically
            </p>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="chart-card fade-in">
            <h3 className="chart-title" style={{ marginBottom: '20px' }}>Change Password</h3>
            
            <form onSubmit={savePassword}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="current"
                  value={password.current}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="new"
                  value={password.new}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password (min 6 characters)"
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirm"
                  value={password.confirm}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        )}

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="chart-card fade-in">
            <h3 className="chart-title" style={{ marginBottom: '20px', color: '#ef4444' }}>Danger Zone</h3>
            
            <div style={{ padding: '20px', border: '2px solid #fee2e2', borderRadius: '10px', background: '#fef2f2' }}>
              <h4 style={{ marginBottom: '10px', color: '#ef4444' }}>Delete Account</h4>
              <p style={{ marginBottom: '20px', color: '#64748b' }}>
                Once you delete your account, there is no going back. All your data will be permanently removed.
              </p>
              <button 
                onClick={deleteAccount} 
                className="btn btn-danger"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Delete My Account'}
              </button>
            </div>

            <div style={{ marginTop: '20px', padding: '20px', background: '#f8fafc', borderRadius: '10px' }}>
              <h4 style={{ marginBottom: '10px' }}>Account Information</h4>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Member since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;