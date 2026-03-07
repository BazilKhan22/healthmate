import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Reminders = () => {
  const { user, logout } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'medicine',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    description: '',
    repeat: 'none'
  });

  // Load reminders from localStorage
  useEffect(() => {
    const savedReminders = localStorage.getItem('reminders');
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
    setLoading(false);
  }, []);

  // Save reminders to localStorage
  const saveReminders = (newReminders) => {
    localStorage.setItem('reminders', JSON.stringify(newReminders));
    setReminders(newReminders);
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newReminder = {
      id: editingReminder ? editingReminder.id : Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      completed: false
    };

    let updatedReminders;
    if (editingReminder) {
      updatedReminders = reminders.map(r => 
        r.id === editingReminder.id ? newReminder : r
      );
    } else {
      updatedReminders = [newReminder, ...reminders];
    }

    saveReminders(updatedReminders);
    setShowAddModal(false);
    setEditingReminder(null);
    resetForm();
  };

  const deleteReminder = (id) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      const updatedReminders = reminders.filter(r => r.id !== id);
      saveReminders(updatedReminders);
    }
  };

  const toggleComplete = (id) => {
    const updatedReminders = reminders.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    );
    saveReminders(updatedReminders);
  };

  const editReminder = (reminder) => {
    setEditingReminder(reminder);
    setFormData({
      title: reminder.title,
      type: reminder.type,
      date: reminder.date,
      time: reminder.time,
      description: reminder.description || '',
      repeat: reminder.repeat || 'none'
    });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'medicine',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      description: '',
      repeat: 'none'
    });
  };

  const getTodayReminders = () => {
    const today = new Date().toISOString().split('T')[0];
    return reminders.filter(r => r.date === today && !r.completed);
  };

  const getUpcomingReminders = () => {
    const today = new Date().toISOString().split('T')[0];
    return reminders.filter(r => r.date > today && !r.completed)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getCompletedReminders = () => {
    return reminders.filter(r => r.completed);
  };

  const reminderTypes = {
    medicine: { icon: '💊', color: '#2563eb', label: 'Medicine' },
    appointment: { icon: '👨‍⚕️', color: '#10b981', label: 'Appointment' },
    report: { icon: '📄', color: '#f59e0b', label: 'Report Upload' },
    exercise: { icon: '🏃', color: '#8b5cf6', label: 'Exercise' },
    other: { icon: '📌', color: '#ec4899', label: 'Other' }
  };

  const repeatOptions = [
    { value: 'none', label: 'No Repeat' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
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
          <Link to="/health-tips" className="nav-link">Health Tips</Link>
          <Link to="/reminders" className="nav-link active">Reminders</Link>
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
            <h1 className="dashboard-title">Health Reminders</h1>
            <p className="dashboard-subtitle">Never miss your medicines, appointments, and health tasks</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            ➕ Add New Reminder
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid" style={{ marginBottom: '25px' }}>
          <div className="stat-card fade-in">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>📅</div>
            </div>
            <div className="stat-title">Today's Reminders</div>
            <div className="stat-number">{getTodayReminders().length}</div>
          </div>

          <div className="stat-card fade-in">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>⏰</div>
            </div>
            <div className="stat-title">Upcoming</div>
            <div className="stat-number">{getUpcomingReminders().length}</div>
          </div>

          <div className="stat-card fade-in">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>✅</div>
            </div>
            <div className="stat-title">Completed</div>
            <div className="stat-number">{getCompletedReminders().length}</div>
          </div>

          <div className="stat-card fade-in">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>📊</div>
            </div>
            <div className="stat-title">Total</div>
            <div className="stat-number">{reminders.length}</div>
          </div>
        </div>

        {loading ? (
          <div className="loading-screen">
            <div className="spinner"></div>
            <p>Loading reminders...</p>
          </div>
        ) : reminders.length === 0 ? (
          <div className="chart-card text-center">
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⏰</div>
            <h2 style={{ marginBottom: '10px' }}>No Reminders Yet</h2>
            <p style={{ color: '#64748b', marginBottom: '30px' }}>
              Add your first reminder to stay on track with your health
            </p>
            <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ width: 'auto' }}>
              ➕ Add Your First Reminder
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {/* Today's Reminders */}
            {getTodayReminders().length > 0 && (
              <div className="chart-card fade-in">
                <h3 className="chart-title" style={{ marginBottom: '15px' }}>📅 Today's Reminders</h3>
                {getTodayReminders().map(reminder => (
                  <div key={reminder.id} className="vital-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                      <input
                        type="checkbox"
                        checked={reminder.completed}
                        onChange={() => toggleComplete(reminder.id)}
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                      />
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: `${reminderTypes[reminder.type]?.color}20`,
                        color: reminderTypes[reminder.type]?.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px'
                      }}>
                        {reminderTypes[reminder.type]?.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600' }}>{reminder.title}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          {reminder.time} • {reminderTypes[reminder.type]?.label}
                          {reminder.repeat !== 'none' && ` • Repeats ${reminder.repeat}`}
                        </div>
                        {reminder.description && (
                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                            📝 {reminder.description}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="report-actions">
                      <button onClick={() => editReminder(reminder)} className="btn btn-outline" style={{ padding: '4px 8px' }}>✏️</button>
                      <button onClick={() => deleteReminder(reminder.id)} className="btn btn-danger" style={{ padding: '4px 8px' }}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upcoming Reminders */}
            {getUpcomingReminders().length > 0 && (
              <div className="chart-card fade-in">
                <h3 className="chart-title" style={{ marginBottom: '15px' }}>⏰ Upcoming Reminders</h3>
                {getUpcomingReminders().map(reminder => (
                  <div key={reminder.id} className="vital-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: `${reminderTypes[reminder.type]?.color}20`,
                        color: reminderTypes[reminder.type]?.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px'
                      }}>
                        {reminderTypes[reminder.type]?.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600' }}>{reminder.title}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          {new Date(reminder.date).toLocaleDateString()} at {reminder.time} • {reminderTypes[reminder.type]?.label}
                        </div>
                      </div>
                    </div>
                    <div className="report-actions">
                      <button onClick={() => editReminder(reminder)} className="btn btn-outline" style={{ padding: '4px 8px' }}>✏️</button>
                      <button onClick={() => deleteReminder(reminder.id)} className="btn btn-danger" style={{ padding: '4px 8px' }}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Completed Reminders */}
            {getCompletedReminders().length > 0 && (
              <div className="chart-card fade-in">
                <h3 className="chart-title" style={{ marginBottom: '15px' }}>✅ Completed</h3>
                {getCompletedReminders().map(reminder => (
                  <div key={reminder.id} className="vital-item" style={{ opacity: 0.7 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: '#e2e8f0',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px'
                      }}>
                        ✅
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', textDecoration: 'line-through' }}>{reminder.title}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          {new Date(reminder.date).toLocaleDateString()} at {reminder.time}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => deleteReminder(reminder.id)} className="btn btn-danger" style={{ padding: '4px 8px' }}>🗑️</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Reminder Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2 className="modal-title">{editingReminder ? 'Edit Reminder' : 'Add New Reminder'}</h2>
                <button className="modal-close" onClick={() => { setShowAddModal(false); setEditingReminder(null); resetForm(); }}>×</button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Take Blood Pressure Medicine"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '10px' }}
                    >
                      {Object.entries(reminderTypes).map(([key, value]) => (
                        <option key={key} value={key}>{value.icon} {value.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Date</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Time</label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Repeat</label>
                    <select
                      name="repeat"
                      value={formData.repeat}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '10px' }}
                    >
                      {repeatOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Description (Optional)</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Add any additional notes..."
                      style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', minHeight: '80px' }}
                    />
                  </div>

                  <div className="flex gap-10">
                    <button type="button" className="btn btn-outline" onClick={() => { setShowAddModal(false); setEditingReminder(null); resetForm(); }} style={{ flex: 1 }}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                      {editingReminder ? 'Update' : 'Add'} Reminder
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reminders;