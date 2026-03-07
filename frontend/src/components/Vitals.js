import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  LineChart, Line, Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Legend
} from 'recharts';

// Modern Chart Components using Recharts
const BPChart = ({ data }) => {
  const chartData = data.map((v, i) => ({
    name: `Day ${i+1}`,
    systolic: v.bloodPressure?.systolic || 0,
    diastolic: v.bloodPressure?.diastolic || 0,
    date: new Date(v.date).toLocaleDateString()
  })).reverse();

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
        <YAxis stroke="#64748b" fontSize={10} />
        <Tooltip 
          contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
          labelStyle={{ color: '#374151', fontWeight: '600' }}
        />
        <Line type="monotone" dataKey="systolic" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="diastolic" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  );
};

const SugarChart = ({ data }) => {
  const chartData = data.map((v, i) => ({
    name: `Day ${i+1}`,
    fasting: v.bloodSugar?.fasting || 0,
    postMeal: v.bloodSugar?.postMeal || 0,
    date: new Date(v.date).toLocaleDateString()
  })).reverse();

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
        <YAxis stroke="#64748b" fontSize={10} />
        <Tooltip 
          contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
          labelStyle={{ color: '#374151', fontWeight: '600' }}
        />
        <Line type="monotone" dataKey="fasting" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="postMeal" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  );
};

const WeightChart = ({ data }) => {
  const chartData = data.map((v, i) => ({
    name: `Day ${i+1}`,
    weight: v.weight || 0,
    date: new Date(v.date).toLocaleDateString()
  })).reverse();

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
        <YAxis stroke="#64748b" fontSize={10} />
        <Tooltip />
        <Area type="monotone" dataKey="weight" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Radar Chart for Health Metrics
const HealthRadar = ({ vitals }) => {
  if (vitals.length === 0) return null;
  
  const latest = vitals[0];
  const data = [
    { subject: 'BP', A: Math.min((latest.bloodPressure?.systolic || 0) / 2, 100), fullMark: 100 },
    { subject: 'Sugar', A: Math.min((latest.bloodSugar?.fasting || 0), 100), fullMark: 100 },
    { subject: 'Weight', A: Math.min((latest.weight || 0) / 100 * 100, 100), fullMark: 100 },
    { subject: 'Heart', A: Math.min((latest.heartRate || 0) / 100 * 100, 100), fullMark: 100 },
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <RadarChart outerRadius={90} data={data}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={10} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" fontSize={10} />
        <Radar name="Health" dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.6} />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
};

// Gauge Component
const Gauge = ({ value, max, label, color, size = 'small' }) => {
  const percentage = value ? (value / max) * 100 : 0;
  
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: size === 'small' ? '80px' : '120px', height: size === 'small' ? '80px' : '120px', margin: '0 auto' }}>
        <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeDasharray={`${percentage}, 100`}
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: size === 'small' ? '16px' : '24px', fontWeight: '700', color: '#374151' }}>{value || '-'}</div>
          <div style={{ fontSize: '10px', color: '#64748b' }}>{label}</div>
        </div>
      </div>
    </div>
  );
};

const Vitals = () => {
  const { user, logout } = useAuth();
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [goals, setGoals] = useState({
    bpSystolic: 120,
    sugarFasting: 100,
    weight: 70,
    heartRate: 70
  });
  const [formData, setFormData] = useState({
    bloodPressure: { systolic: '', diastolic: '' },
    bloodSugar: { fasting: '', postMeal: '' },
    weight: '',
    height: '',
    heartRate: '',
    temperature: '',
    notes: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVitals();
  }, []);

  const fetchVitals = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/vitals`);
      // Sort by date descending (most recent first)
      const sortedData = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setVitals(sortedData);
    } catch (error) {
      console.error('Error fetching vitals:', error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      // Validate at least one field has data
      const hasData = formData.bloodPressure.systolic || 
                      formData.bloodPressure.diastolic || 
                      formData.bloodSugar.fasting || 
                      formData.bloodSugar.postMeal || 
                      formData.weight || 
                      formData.heartRate || 
                      formData.temperature;
                      
      if (!hasData) {
        setError('Please fill at least one vital field');
        setSaving(false);
        return;
      }

      await axios.post(`${process.env.REACT_APP_API_URL}/vitals`, formData);
      
      // Reset form
      setFormData({
        bloodPressure: { systolic: '', diastolic: '' },
        bloodSugar: { fasting: '', postMeal: '' },
        weight: '',
        height: '',
        heartRate: '',
        temperature: '',
        notes: ''
      });
      
      setShowForm(false);
      fetchVitals(); // Refresh the list
      
    } catch (error) {
      console.error('Error adding vitals:', error);
      setError(error.response?.data?.message || 'Error saving vitals. Please try again.');
    }
    setSaving(false);
  };

  const deleteVital = async (vitalId) => {
    if (window.confirm('Are you sure you want to delete this vital record?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/vitals/${vitalId}`);
        setVitals(vitals.filter(v => v._id !== vitalId));
      } catch (error) {
        console.error('Error deleting vital:', error);
      }
    }
  };

  // Get latest vital for display
  const latestVital = vitals.length > 0 ? vitals[0] : null;

  // Filter data based on period
  const getFilteredData = () => {
    const now = new Date();
    const periods = {
      week: new Date(now.setDate(now.getDate() - 7)),
      month: new Date(now.setMonth(now.getMonth() - 1)),
      quarter: new Date(now.setMonth(now.getMonth() - 3))
    };
    const cutoff = periods[selectedPeriod];
    return vitals.filter(v => new Date(v.date) > cutoff);
  };

  const filteredVitals = getFilteredData();
  const recentVitals = vitals.slice(0, 10);

  return (
    <div>
      <nav className="navbar">
        <Link to="/dashboard" className="nav-brand">
          🏥 <span style={{ fontWeight: 700 }}>HealthMate</span>
        </Link>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/reports" className="nav-link">Reports</Link>
          <Link to="/vitals" className="nav-link active">Vitals</Link>
          <Link to="/health-tips" className="nav-link">Health Tips</Link>
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

      <div className="vitals-container">
        {/* Header */}
        <div className="reports-header">
          <div>
            <h1 className="dashboard-title">Health Vitals Dashboard</h1>
            <p className="dashboard-subtitle">Track and monitor your daily health metrics</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            ➕ Add New Vitals
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {/* Summary Cards - SHOW LATEST VITAL */}
        <div className="stats-grid" style={{ marginBottom: '25px' }}>
          <div className="stat-card fade-in">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>❤️</div>
              <span className="stat-trend">Latest</span>
            </div>
            <div className="stat-title">Blood Pressure</div>
            <div className="stat-number">
              {latestVital 
                ? `${latestVital.bloodPressure?.systolic || '-'}/${latestVital.bloodPressure?.diastolic || '-'}` 
                : '-/-'}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '5px' }}>
              {latestVital ? new Date(latestVital.date).toLocaleDateString() : 'No data'}
            </div>
          </div>

          <div className="stat-card fade-in">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>🩸</div>
              <span className="stat-trend">Latest</span>
            </div>
            <div className="stat-title">Blood Sugar</div>
            <div className="stat-number">
              {latestVital ? latestVital.bloodSugar?.fasting || '-' : '-'}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '5px' }}>
              {latestVital ? 'Fasting' : 'No data'}
            </div>
          </div>

          <div className="stat-card fade-in">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>⚖️</div>
              <span className="stat-trend">Latest</span>
            </div>
            <div className="stat-title">Weight</div>
            <div className="stat-number">
              {latestVital ? `${latestVital.weight || '-'} kg` : '-'}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '5px' }}>
              {latestVital ? 'Current' : 'No data'}
            </div>
          </div>

          <div className="stat-card fade-in">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>💓</div>
              <span className="stat-trend">Latest</span>
            </div>
            <div className="stat-title">Heart Rate</div>
            <div className="stat-number">
              {latestVital ? `${latestVital.heartRate || '-'} bpm` : '-'}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '5px' }}>
              {latestVital ? 'Current' : 'No data'}
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px', marginBottom: '25px' }}>
          {/* Left Column - Charts */}
          <div>
            {/* Period Selector */}
            {vitals.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', justifyContent: 'flex-end' }}>
                {['week', 'month', 'quarter'].map(period => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    style={{
                      padding: '6px 12px',
                      background: selectedPeriod === period ? '#2563eb' : 'white',
                      color: selectedPeriod === period ? 'white' : '#64748b',
                      border: '1px solid #e2e8f0',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            )}

            {/* BP Chart */}
            <div className="chart-card fade-in" style={{ marginBottom: '25px' }}>
              <div className="chart-header">
                <h3 className="chart-title">Blood Pressure Trends</h3>
              </div>
              {filteredVitals.length > 0 ? (
                <BPChart data={filteredVitals} />
              ) : (
                <div className="text-center" style={{ padding: '60px 0', color: '#64748b' }}>
                  <p>No data for selected period</p>
                </div>
              )}
            </div>

            {/* Sugar Chart */}
            <div className="chart-card fade-in" style={{ marginBottom: '25px' }}>
              <div className="chart-header">
                <h3 className="chart-title">Blood Sugar Trends</h3>
              </div>
              {filteredVitals.length > 0 ? (
                <SugarChart data={filteredVitals} />
              ) : (
                <div className="text-center" style={{ padding: '60px 0', color: '#64748b' }}>
                  <p>No data for selected period</p>
                </div>
              )}
            </div>

            {/* Weight Chart */}
            <div className="chart-card fade-in">
              <div className="chart-header">
                <h3 className="chart-title">Weight Trends</h3>
              </div>
              {filteredVitals.length > 0 ? (
                <WeightChart data={filteredVitals} />
              ) : (
                <div className="text-center" style={{ padding: '60px 0', color: '#64748b' }}>
                  <p>No data for selected period</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Insights */}
          <div>
            {/* Health Radar - Show latest vital */}
            <div className="chart-card fade-in" style={{ marginBottom: '25px' }}>
              <div className="chart-header">
                <h3 className="chart-title">Current Health Snapshot</h3>
              </div>
              {latestVital ? (
                <HealthRadar vitals={vitals} />
              ) : (
                <div className="text-center" style={{ padding: '60px 0', color: '#64748b' }}>
                  <p>Add vitals to see snapshot</p>
                </div>
              )}
            </div>

            {/* Goals Progress - Based on latest vital */}
            <div className="chart-card fade-in" style={{ marginBottom: '25px' }}>
              <div className="chart-header">
                <h3 className="chart-title">Latest vs Goals</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                <Gauge 
                  value={latestVital?.bloodPressure?.systolic} 
                  max={goals.bpSystolic} 
                  label="BP Goal" 
                  color="#2563eb" 
                  size="small" 
                />
                <Gauge 
                  value={latestVital?.bloodSugar?.fasting} 
                  max={goals.sugarFasting} 
                  label="Sugar Goal" 
                  color="#10b981" 
                  size="small" 
                />
                <Gauge 
                  value={latestVital?.weight} 
                  max={goals.weight} 
                  label="Weight Goal" 
                  color="#f59e0b" 
                  size="small" 
                />
                <Gauge 
                  value={latestVital?.heartRate} 
                  max={goals.heartRate} 
                  label="HR Goal" 
                  color="#8b5cf6" 
                  size="small" 
                />
              </div>
            </div>

            {/* Health Tips - Based on latest vital */}
            {latestVital && (
              <div className="chart-card fade-in">
                <div className="chart-header">
                  <h3 className="chart-title">Personalized Insights</h3>
                </div>
                <div style={{ marginTop: '15px' }}>
                  <div style={{ padding: '12px', background: 'rgba(37, 99, 235, 0.05)', borderRadius: '8px', marginBottom: '10px' }}>
                    <strong style={{ fontSize: '13px', color: '#2563eb' }}>💡 Blood Pressure</strong>
                    <p style={{ fontSize: '12px', marginTop: '5px' }}>
                      {latestVital.bloodPressure?.systolic > 140 
                        ? 'Your BP is above normal. Consider reducing salt intake.' 
                        : latestVital.bloodPressure?.systolic < 90 
                        ? 'Your BP is low. Stay hydrated and consult doctor.'
                        : 'Your BP is in normal range. Keep it up!'}
                    </p>
                  </div>
                  
                  <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', marginBottom: '10px' }}>
                    <strong style={{ fontSize: '13px', color: '#10b981' }}>🩸 Blood Sugar</strong>
                    <p style={{ fontSize: '12px', marginTop: '5px' }}>
                      {latestVital.bloodSugar?.fasting > 140 
                        ? 'Your sugar is elevated. Limit carbs and exercise more.' 
                        : latestVital.bloodSugar?.fasting < 70 
                        ? 'Low sugar detected. Have a small snack.' 
                        : 'Your sugar is well controlled. Great job!'}
                    </p>
                  </div>

                  <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '8px' }}>
                    <strong style={{ fontSize: '13px', color: '#f59e0b' }}>⚖️ Weight</strong>
                    <p style={{ fontSize: '12px', marginTop: '5px' }}>
                      {latestVital.weight > goals.weight + 5 
                        ? 'You\'re above your target weight. Stay consistent with diet.' 
                        : latestVital.weight < goals.weight - 5 
                        ? 'You\'re below target. Ensure adequate nutrition.' 
                        : 'You\'re at your target weight. Perfect!'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Vitals Form */}
        {showForm && (
          <div className="vitals-form fade-in">
            <div className="chart-header">
              <h3 className="chart-title">Record New Vitals</h3>
              <button onClick={() => setShowForm(false)} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Systolic BP (mmHg)</label>
                  <input 
                    type="number" 
                    name="bloodPressure.systolic" 
                    value={formData.bloodPressure.systolic} 
                    onChange={handleChange} 
                    placeholder="120" 
                    min="70" 
                    max="200" 
                  />
                </div>
                <div className="form-group">
                  <label>Diastolic BP (mmHg)</label>
                  <input 
                    type="number" 
                    name="bloodPressure.diastolic" 
                    value={formData.bloodPressure.diastolic} 
                    onChange={handleChange} 
                    placeholder="80" 
                    min="40" 
                    max="130" 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fasting Sugar (mg/dL)</label>
                  <input 
                    type="number" 
                    name="bloodSugar.fasting" 
                    value={formData.bloodSugar.fasting} 
                    onChange={handleChange} 
                    placeholder="95" 
                    min="50" 
                    max="300" 
                  />
                </div>
                <div className="form-group">
                  <label>Post-Meal Sugar (mg/dL)</label>
                  <input 
                    type="number" 
                    name="bloodSugar.postMeal" 
                    value={formData.bloodSugar.postMeal} 
                    onChange={handleChange} 
                    placeholder="140" 
                    min="50" 
                    max="400" 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Weight (kg)</label>
                  <input 
                    type="number" 
                    name="weight" 
                    value={formData.weight} 
                    onChange={handleChange} 
                    placeholder="70" 
                    min="20" 
                    max="200" 
                    step="0.1" 
                  />
                </div>
                <div className="form-group">
                  <label>Height (cm)</label>
                  <input 
                    type="number" 
                    name="height" 
                    value={formData.height} 
                    onChange={handleChange} 
                    placeholder="175" 
                    min="100" 
                    max="220" 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Heart Rate (bpm)</label>
                  <input 
                    type="number" 
                    name="heartRate" 
                    value={formData.heartRate} 
                    onChange={handleChange} 
                    placeholder="72" 
                    min="40" 
                    max="200" 
                  />
                </div>
                <div className="form-group">
                  <label>Temperature (°C)</label>
                  <input 
                    type="number" 
                    name="temperature" 
                    value={formData.temperature} 
                    onChange={handleChange} 
                    step="0.1" 
                    placeholder="36.6" 
                    min="35" 
                    max="42" 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea 
                  name="notes" 
                  value={formData.notes} 
                  onChange={handleChange} 
                  placeholder="How are you feeling today?" 
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px', 
                    border: '2px solid #e2e8f0', 
                    borderRadius: '10px', 
                    fontSize: '14px', 
                    minHeight: '80px' 
                  }} 
                />
              </div>

              <div className="flex gap-10">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1 }}>
                  {saving ? 'Saving...' : '💾 Save Vitals'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Vitals History */}
        <div className="vitals-history fade-in">
          <div className="chart-header">
            <h3 className="chart-title">Vitals History</h3>
            <div style={{ fontSize: '14px', color: '#64748b' }}>{vitals.length} records</div>
          </div>

          {loading ? (
            <div className="loading-screen" style={{ height: '200px' }}>
              <div className="spinner"></div>
              <p>Loading...</p>
            </div>
          ) : vitals.length === 0 ? (
            <div className="text-center" style={{ padding: '60px 0', color: '#64748b' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>💓</div>
              <h3>No Vitals Yet</h3>
              <p>Start tracking your health metrics</p>
              <button onClick={() => setShowForm(true)} className="btn btn-primary" style={{ width: 'auto', marginTop: '20px' }}>
                Add First Vitals
              </button>
            </div>
          ) : (
            <div>
              {recentVitals.map((vital, index) => (
                <div key={vital._id || index} className="vital-item fade-in">
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{ fontWeight: '600', minWidth: '100px' }}>
                        {new Date(vital.date).toLocaleDateString()}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '16px', fontWeight: '600' }}>
                            {vital.bloodPressure?.systolic || '-'}/{vital.bloodPressure?.diastolic || '-'}
                          </div>
                          <div style={{ fontSize: '10px', color: '#64748b' }}>BP</div>
                        </div>
                        
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '16px', fontWeight: '600' }}>{vital.bloodSugar?.fasting || '-'}</div>
                          <div style={{ fontSize: '10px', color: '#64748b' }}>Sugar</div>
                        </div>
                        
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '16px', fontWeight: '600' }}>{vital.weight ? `${vital.weight}kg` : '-'}</div>
                          <div style={{ fontSize: '10px', color: '#64748b' }}>Weight</div>
                        </div>
                        
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '16px', fontWeight: '600' }}>{vital.heartRate ? `${vital.heartRate}bpm` : '-'}</div>
                          <div style={{ fontSize: '10px', color: '#64748b' }}>HR</div>
                        </div>
                        
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '16px', fontWeight: '600' }}>{vital.temperature ? `${vital.temperature}°C` : '-'}</div>
                          <div style={{ fontSize: '10px', color: '#64748b' }}>Temp</div>
                        </div>
                      </div>
                    </div>
                    
                    {vital.notes && (
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px', fontStyle: 'italic' }}>
                        📝 {vital.notes}
                      </div>
                    )}
                  </div>
                  
                  <button onClick={() => deleteVital(vital._id)} className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '12px', minWidth: 'auto' }}>
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vitals;