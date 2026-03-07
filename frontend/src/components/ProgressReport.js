import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell,
  CartesianGrid, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';

const ProgressReport = () => {
  const { user, logout } = useAuth();
  const [reports, setReports] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6months');
  const [healthScore, setHealthScore] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (reports.length > 0 || vitals.length > 0) {
      calculateHealthScore();
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
    
    // Points for regular tracking
    if (vitals.length > 0) {
      const lastMonth = vitals.filter(v => 
        new Date(v.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length;
      score += Math.min(lastMonth * 2, 15);
    }
    
    if (reports.length > 0) {
      score += Math.min(reports.length * 3, 15);
    }
    
    setHealthScore(Math.min(Math.round(score), 100));
  };

  // Filter data based on time range
  const getFilteredData = () => {
    const now = new Date();
    const ranges = {
      '3months': new Date(now.setMonth(now.getMonth() - 3)),
      '6months': new Date(now.setMonth(now.getMonth() - 6)),
      '1year': new Date(now.setFullYear(now.getFullYear() - 1))
    };
    const cutoff = ranges[timeRange];
    
    return {
      reports: reports.filter(r => new Date(r.reportDate) > cutoff),
      vitals: vitals.filter(v => new Date(v.date) > cutoff)
    };
  };

  const filtered = getFilteredData();

  // Prepare chart data
  const prepareMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = [];
    
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = months[date.getMonth()];
      const year = date.getFullYear();
      
      const monthReports = filtered.reports.filter(r => 
        new Date(r.reportDate).getMonth() === date.getMonth() &&
        new Date(r.reportDate).getFullYear() === year
      ).length;
      
      const monthVitals = filtered.vitals.filter(v => 
        new Date(v.date).getMonth() === date.getMonth() &&
        new Date(v.date).getFullYear() === year
      ).length;
      
      data.unshift({
        month: monthName,
        reports: monthReports,
        vitals: monthVitals,
        total: monthReports + monthVitals
      });
    }
    
    return data;
  };

  const monthlyData = prepareMonthlyData();

  // Prepare vitals trends
  const prepareVitalsData = () => {
    return vitals.slice(0, 10).reverse().map(v => ({
      date: new Date(v.date).toLocaleDateString(),
      bp: v.bloodPressure?.systolic || 0,
      sugar: v.bloodSugar?.fasting || 0,
      weight: v.weight || 0,
      heartRate: v.heartRate || 0
    }));
  };

  const vitalsData = prepareVitalsData();

  // Report types distribution
  const reportTypes = reports.reduce((acc, report) => {
    acc[report.reportType] = (acc[report.reportType] || 0) + 1;
    return acc;
  }, {});

  const pieData = [
    { name: 'Blood Test', value: reportTypes.blood_test || 0, color: '#2563eb' },
    { name: 'X-Ray', value: reportTypes.xray || 0, color: '#10b981' },
    { name: 'MRI', value: reportTypes.mri || 0, color: '#f59e0b' },
    { name: 'Ultrasound', value: reportTypes.ultrasound || 0, color: '#8b5cf6' },
    { name: 'ECG', value: reportTypes.ecg || 0, color: '#ec4899' },
    { name: 'Other', value: reportTypes.other || 0, color: '#64748b' }
  ].filter(item => item.value > 0);

  // Calculate averages
  const avgBP = vitals.length > 0 
    ? Math.round(vitals.reduce((acc, v) => acc + (v.bloodPressure?.systolic || 0), 0) / vitals.length)
    : 0;
  
  const avgSugar = vitals.length > 0
    ? Math.round(vitals.reduce((acc, v) => acc + (v.bloodSugar?.fasting || 0), 0) / vitals.length)
    : 0;
  
  const avgWeight = vitals.length > 0
    ? Math.round(vitals.reduce((acc, v) => acc + (v.weight || 0), 0) / vitals.length * 10) / 10
    : 0;

  // Download report as PDF
  const downloadPDF = () => {
    const element = document.createElement('a');
    const content = `
      HealthMate Progress Report
      Generated on: ${new Date().toLocaleDateString()}
      
      Health Score: ${healthScore}
      Total Reports: ${reports.length}
      Total Vitals: ${vitals.length}
      Average BP: ${avgBP}
      Average Sugar: ${avgSugar}
      Average Weight: ${avgWeight}kg
      
      Generated by HealthMate - Your AI Health Assistant
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(blob);
    element.download = `HealthMate_Progress_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
            <h1 className="dashboard-title">Your Health Progress Report</h1>
            <p className="dashboard-subtitle">Track your journey and health improvements over time</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={{
                padding: '10px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last 1 Year</option>
            </select>
            <button onClick={downloadPDF} className="btn btn-primary">
              📥 Download Report
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-screen">
            <div className="spinner"></div>
            <p>Generating your progress report...</p>
          </div>
        ) : (
          <>
            {/* Health Score Card */}
            <div className="chart-card fade-in" style={{ marginBottom: '25px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', marginBottom: '10px', opacity: 0.9 }}>Your Health Score</h2>
                  <div style={{ fontSize: '48px', fontWeight: '700' }}>{healthScore}</div>
                  <p style={{ marginTop: '10px', opacity: 0.9 }}>out of 100</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', marginBottom: '5px' }}>Better than last month</div>
                  <div style={{ fontSize: '24px', fontWeight: '600' }}>+12%</div>
                </div>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="stats-grid" style={{ marginBottom: '25px' }}>
              <div className="stat-card fade-in">
                <div className="stat-header">
                  <div className="stat-icon reports">📊</div>
                </div>
                <div className="stat-title">Total Reports</div>
                <div className="stat-number">{reports.length}</div>
                <div className="stat-trend trend-up">+{filtered.reports.length} this period</div>
              </div>

              <div className="stat-card fade-in">
                <div className="stat-header">
                  <div className="stat-icon vitals">❤️</div>
                </div>
                <div className="stat-title">Vitals Recorded</div>
                <div className="stat-number">{vitals.length}</div>
                <div className="stat-trend trend-up">+{filtered.vitals.length} this period</div>
              </div>

              <div className="stat-card fade-in">
                <div className="stat-header">
                  <div className="stat-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>📅</div>
                </div>
                <div className="stat-title">Days Active</div>
                <div className="stat-number">{Math.min(vitals.length + reports.length, 90)}</div>
                <div className="stat-trend trend-up">Active streak</div>
              </div>

              <div className="stat-card fade-in">
                <div className="stat-header">
                  <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>⚖️</div>
                </div>
                <div className="stat-title">Avg. Weight</div>
                <div className="stat-number">{avgWeight} kg</div>
                <div className="stat-trend trend-up">Stable</div>
              </div>
            </div>

            {/* Monthly Activity Chart */}
            <div className="chart-card fade-in" style={{ marginBottom: '25px' }}>
              <div className="chart-header">
                <h3 className="chart-title">Monthly Activity Overview</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="reports" name="Reports" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="vitals" name="Vitals" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Vitals Trends */}
            {vitalsData.length > 0 && (
              <div className="chart-card fade-in" style={{ marginBottom: '25px' }}>
                <div className="chart-header">
                  <h3 className="chart-title">Blood Pressure Trends</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={vitalsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="bp" name="BP (Systolic)" stroke="#2563eb" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Two Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
              {/* Report Types Distribution */}
              {pieData.length > 0 && (
                <div className="chart-card fade-in">
                  <div className="chart-header">
                    <h3 className="chart-title">Report Types Distribution</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Averages Card */}
              <div className="chart-card fade-in">
                <div className="chart-header">
                  <h3 className="chart-title">Health Averages</h3>
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span>Blood Pressure</span>
                      <span style={{ fontWeight: '600', color: '#2563eb' }}>{avgBP} mmHg</span>
                    </div>
                    <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px' }}>
                      <div style={{ width: `${Math.min(avgBP / 2, 100)}%`, height: '100%', background: '#2563eb', borderRadius: '4px' }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span>Blood Sugar</span>
                      <span style={{ fontWeight: '600', color: '#10b981' }}>{avgSugar} mg/dL</span>
                    </div>
                    <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px' }}>
                      <div style={{ width: `${Math.min(avgSugar, 100)}%`, height: '100%', background: '#10b981', borderRadius: '4px' }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span>Weight</span>
                      <span style={{ fontWeight: '600', color: '#f59e0b' }}>{avgWeight} kg</span>
                    </div>
                    <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px' }}>
                      <div style={{ width: `${Math.min(avgWeight, 100)}%`, height: '100%', background: '#f59e0b', borderRadius: '4px' }} />
                    </div>
                  </div>

                  <div style={{ marginTop: '30px', padding: '15px', background: '#f8fafc', borderRadius: '8px' }}>
                    <h4 style={{ marginBottom: '10px', fontSize: '14px', color: '#374151' }}>Summary</h4>
                    <p style={{ fontSize: '13px', color: '#64748b' }}>
                      You've been tracking your health for {Math.max(Math.floor((new Date() - new Date(user?.createdAt || Date.now())) / (1000 * 60 * 60 * 24)), 1)} days. 
                      Your health score is {healthScore}/100. Keep up the great work!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="chart-card fade-in">
              <div className="chart-header">
                <h3 className="chart-title">Personalized Recommendations</h3>
              </div>
              <div style={{ padding: '20px' }}>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {avgBP > 130 && (
                    <li style={{ padding: '10px', background: '#fef2f2', borderRadius: '8px', marginBottom: '10px', color: '#ef4444' }}>
                      ⚠️ Your blood pressure is above normal. Consider reducing salt intake and exercise regularly.
                    </li>
                  )}
                  {avgSugar > 120 && (
                    <li style={{ padding: '10px', background: '#fef2f2', borderRadius: '8px', marginBottom: '10px', color: '#ef4444' }}>
                      ⚠️ Your blood sugar is elevated. Limit carbs and monitor your sugar intake.
                    </li>
                  )}
                  {reports.length < 2 && (
                    <li style={{ padding: '10px', background: '#eff6ff', borderRadius: '8px', marginBottom: '10px', color: '#2563eb' }}>
                      ℹ️ Add more medical reports for better AI analysis and insights.
                    </li>
                  )}
                  {vitals.length < 10 && (
                    <li style={{ padding: '10px', background: '#eff6ff', borderRadius: '8px', marginBottom: '10px', color: '#2563eb' }}>
                      ℹ️ Track your vitals regularly to see meaningful trends.
                    </li>
                  )}
                  <li style={{ padding: '10px', background: '#f0fdf4', borderRadius: '8px', color: '#10b981' }}>
                  ✅ You're doing great! Keep maintaining your healthy habits.
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProgressReport;