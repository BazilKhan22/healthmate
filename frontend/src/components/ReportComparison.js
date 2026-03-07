import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ReportComparison = () => {
  const { user, logout } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [report1, setReport1] = useState(null);
  const [report2, setReport2] = useState(null);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/reports`);
      // Filter out reports without abnormal values for better comparison
      const reportsWithData = response.data.filter(r => 
        r.abnormalValues && r.abnormalValues.length > 0
      );
      setReports(reportsWithData.length > 0 ? reportsWithData : response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Failed to load reports');
    }
    setLoading(false);
  };

  const compareReports = () => {
    if (!report1 || !report2) {
      alert('Please select two reports to compare');
      return;
    }

    // Extract data from both reports
    const data1 = report1.abnormalValues || [];
    const data2 = report2.abnormalValues || [];
    
    // If no abnormal values, show message
    if (data1.length === 0 && data2.length === 0) {
      setComparisonResult({
        message: 'No abnormal values found in selected reports to compare.',
        data: [],
        summary: { improved: 0, worsened: 0, unchanged: 0, totalParams: 0 }
      });
      return;
    }

    // Create a map of all parameters
    const paramMap = new Map();
    
    // Add parameters from report 1
    data1.forEach(item => {
      paramMap.set(item.parameter, {
        parameter: item.parameter,
        value1: item.value,
        normalRange1: item.normalRange,
        significance1: item.significance,
        value2: 'Not measured',
        normalRange2: '',
        significance2: ''
      });
    });

    // Add/update parameters from report 2
    data2.forEach(item => {
      if (paramMap.has(item.parameter)) {
        const existing = paramMap.get(item.parameter);
        existing.value2 = item.value;
        existing.normalRange2 = item.normalRange;
        existing.significance2 = item.significance;
      } else {
        paramMap.set(item.parameter, {
          parameter: item.parameter,
          value1: 'Not measured',
          normalRange1: '',
          significance1: '',
          value2: item.value,
          normalRange2: item.normalRange,
          significance2: item.significance
        });
      }
    });

    // Convert map to array and analyze changes
    const comparisonData = Array.from(paramMap.values()).map(item => {
      // Determine if value is within normal range
      const isNormal1 = !item.value1 || item.value1 === 'Normal' || item.value1 === 'Not measured';
      const isNormal2 = !item.value2 || item.value2 === 'Normal' || item.value2 === 'Not measured';
      
      let status = 'Same';
      if (item.value1 !== 'Not measured' && item.value2 !== 'Not measured') {
        if (isNormal1 && !isNormal2) status = 'Worsened';
        else if (!isNormal1 && isNormal2) status = 'Improved';
        else status = 'Same';
      }
      
      return { ...item, status };
    });

    // Calculate summary
    const summary = {
      improved: comparisonData.filter(d => d.status === 'Improved').length,
      worsened: comparisonData.filter(d => d.status === 'Worsened').length,
      unchanged: comparisonData.filter(d => d.status === 'Same').length,
      totalParams: comparisonData.length
    };

    setComparisonResult({ data: comparisonData, summary });
  };

  const resetComparison = () => {
    setReport1(null);
    setReport2(null);
    setComparisonResult(null);
    setError('');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Improved': return '#10b981';
      case 'Worsened': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Improved': return '✅';
      case 'Worsened': return '⚠️';
      default: return '➡️';
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
          <Link to="/reports" className="nav-link active">Reports</Link>
          <Link to="/vitals" className="nav-link">Vitals</Link>
          <Link to="/health-tips" className="nav-link">Health Tips</Link>
          <Link to="/reminders" className="nav-link">Reminders</Link>
          <Link to="/progress-report" className="nav-link">Progress</Link>
          <Link to="/settings" className="nav-link">Settings</Link>
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
            <h1 className="dashboard-title">Report Comparison</h1>
            <p className="dashboard-subtitle">Compare two medical reports to track changes over time</p>
          </div>
          {comparisonResult && (
            <button onClick={resetComparison} className="btn btn-outline">
              🔄 New Comparison
            </button>
          )}
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-screen">
            <div className="spinner"></div>
            <p>Loading reports...</p>
          </div>
        ) : reports.length < 2 ? (
          <div className="chart-card text-center">
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📊</div>
            <h2 style={{ marginBottom: '10px' }}>Not Enough Reports</h2>
            <p style={{ color: '#64748b', marginBottom: '30px' }}>
              You need at least 2 reports to compare. 
              {reports.length === 1 ? ' You have 1 report. Add one more.' : ' Upload more reports first.'}
            </p>
            <Link to="/reports">
              <button className="btn btn-primary" style={{ width: 'auto' }}>
                📄 Go to Reports
              </button>
            </Link>
          </div>
        ) : !comparisonResult ? (
          /* Report Selection */
          <div className="chart-card">
            <h3 className="chart-title" style={{ marginBottom: '20px' }}>Select Reports to Compare</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              {/* Report 1 Selection */}
              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>First Report</label>
                <select
                  value={report1?._id || ''}
                  onChange={(e) => {
                    const selected = reports.find(r => r._id === e.target.value);
                    setReport1(selected);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select a report</option>
                  {reports.map(report => (
                    <option key={report._id} value={report._id}>
                      {report.title} - {new Date(report.reportDate).toLocaleDateString()}
                      {report.abnormalValues?.length > 0 ? ' 📊' : ' 📄'}
                    </option>
                  ))}
                </select>

                {report1 && (
                  <div style={{ marginTop: '15px', padding: '15px', background: '#f8fafc', borderRadius: '8px' }}>
                    <h4 style={{ marginBottom: '10px', color: '#2563eb' }}>{report1.title}</h4>
                    <p style={{ fontSize: '13px', marginBottom: '5px' }}>
                      <strong>Date:</strong> {new Date(report1.reportDate).toLocaleDateString()}
                    </p>
                    <p style={{ fontSize: '13px' }}>
                      <strong>Parameters:</strong> {report1.abnormalValues?.length || 0} abnormal values
                    </p>
                  </div>
                )}
              </div>

              {/* Report 2 Selection */}
              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>Second Report</label>
                <select
                  value={report2?._id || ''}
                  onChange={(e) => {
                    const selected = reports.find(r => r._id === e.target.value);
                    setReport2(selected);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select a report</option>
                  {reports.map(report => (
                    <option key={report._id} value={report._id}>
                      {report.title} - {new Date(report.reportDate).toLocaleDateString()}
                      {report.abnormalValues?.length > 0 ? ' 📊' : ' 📄'}
                    </option>
                  ))}
                </select>

                {report2 && (
                  <div style={{ marginTop: '15px', padding: '15px', background: '#f8fafc', borderRadius: '8px' }}>
                    <h4 style={{ marginBottom: '10px', color: '#10b981' }}>{report2.title}</h4>
                    <p style={{ fontSize: '13px', marginBottom: '5px' }}>
                      <strong>Date:</strong> {new Date(report2.reportDate).toLocaleDateString()}
                    </p>
                    <p style={{ fontSize: '13px' }}>
                      <strong>Parameters:</strong> {report2.abnormalValues?.length || 0} abnormal values
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                onClick={compareReports}
                disabled={!report1 || !report2}
                className="btn btn-primary"
                style={{ 
                  width: '200px',
                  opacity: (!report1 || !report2) ? 0.5 : 1,
                  cursor: (!report1 || !report2) ? 'not-allowed' : 'pointer'
                }}
              >
                📊 Compare Reports
              </button>
            </div>
          </div>
        ) : (
          /* Comparison Results */
          <div>
            {/* Summary Cards */}
            <div className="stats-grid" style={{ marginBottom: '25px' }}>
              <div className="stat-card fade-in">
                <div className="stat-header">
                  <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>✅</div>
                </div>
                <div className="stat-title">Improved</div>
                <div className="stat-number">{comparisonResult.summary.improved}</div>
                <div className="stat-trend trend-up">Parameters</div>
              </div>

              <div className="stat-card fade-in">
                <div className="stat-header">
                  <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>⚠️</div>
                </div>
                <div className="stat-title">Worsened</div>
                <div className="stat-number">{comparisonResult.summary.worsened}</div>
                <div className="stat-trend trend-down">Parameters</div>
              </div>

              <div className="stat-card fade-in">
                <div className="stat-header">
                  <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>📊</div>
                </div>
                <div className="stat-title">Unchanged</div>
                <div className="stat-number">{comparisonResult.summary.unchanged}</div>
                <div className="stat-trend">Parameters</div>
              </div>

              <div className="stat-card fade-in">
                <div className="stat-header">
                  <div className="stat-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>📋</div>
                </div>
                <div className="stat-title">Total</div>
                <div className="stat-number">{comparisonResult.summary.totalParams}</div>
                <div className="stat-trend">Parameters</div>
              </div>
            </div>

            {/* Comparison Message */}
            {comparisonResult.message && (
              <div className="chart-card fade-in" style={{ marginBottom: '25px', textAlign: 'center' }}>
                <p style={{ color: '#64748b', fontSize: '16px' }}>{comparisonResult.message}</p>
              </div>
            )}

            {/* Comparison Table */}
            {comparisonResult.data.length > 0 && (
              <div className="chart-card fade-in">
                <div className="chart-header">
                  <h3 className="chart-title">Detailed Parameter Comparison</h3>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>
                    {new Date(report1.reportDate).toLocaleDateString()} vs {new Date(report2.reportDate).toLocaleDateString()}
                  </div>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Parameter</th>
                        <th style={{ padding: '15px', textAlign: 'center' }} colSpan="2">First Report</th>
                        <th style={{ padding: '15px', textAlign: 'center' }} colSpan="2">Second Report</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
                      </tr>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <th style={{ padding: '5px 15px' }}></th>
                        <th style={{ padding: '5px 15px', textAlign: 'center', fontSize: '12px' }}>Value</th>
                        <th style={{ padding: '5px 15px', textAlign: 'center', fontSize: '12px' }}>Normal Range</th>
                        <th style={{ padding: '5px 15px', textAlign: 'center', fontSize: '12px' }}>Value</th>
                        <th style={{ padding: '5px 15px', textAlign: 'center', fontSize: '12px' }}>Normal Range</th>
                        <th style={{ padding: '5px 15px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonResult.data.map((item, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '12px 15px', fontWeight: '500' }}>{item.parameter}</td>
                          <td style={{ 
                            padding: '12px 15px', 
                            textAlign: 'center',
                            color: item.value1 === 'Not measured' ? '#64748b' : 
                                   (item.value1 === 'Normal' || !item.value1) ? '#10b981' : '#ef4444',
                            fontWeight: (item.value1 !== 'Not measured' && item.value1 !== 'Normal') ? '600' : '400'
                          }}>
                            {item.value1 === 'Not measured' ? '-' : item.value1}
                          </td>
                          <td style={{ padding: '12px 15px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
                            {item.normalRange1 || '-'}
                          </td>
                          <td style={{ 
                            padding: '12px 15px', 
                            textAlign: 'center',
                            color: item.value2 === 'Not measured' ? '#64748b' : 
                                   (item.value2 === 'Normal' || !item.value2) ? '#10b981' : '#ef4444',
                            fontWeight: (item.value2 !== 'Not measured' && item.value2 !== 'Normal') ? '600' : '400'
                          }}>
                            {item.value2 === 'Not measured' ? '-' : item.value2}
                          </td>
                          <td style={{ padding: '12px 15px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
                            {item.normalRange2 || '-'}
                          </td>
                          <td style={{ padding: '12px 15px' }}>
                            <span style={{ 
                              color: getStatusColor(item.status),
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}>
                              {getStatusIcon(item.status)} {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* AI Insights */}
            {comparisonResult.summary.totalParams > 0 && (
              <div className="chart-card fade-in">
                <div className="chart-header">
                  <h3 className="chart-title">🤖 AI Health Insights</h3>
                </div>
                <div style={{ padding: '20px' }}>
                  {comparisonResult.summary.improved > 0 && (
                    <div style={{ marginBottom: '15px', padding: '15px', background: '#f0fdf4', borderRadius: '8px' }}>
                      <strong style={{ color: '#10b981' }}>✅ Improvements Detected:</strong>
                      <p style={{ marginTop: '5px', fontSize: '14px', color: '#374151' }}>
                        {comparisonResult.summary.improved} parameter(s) have improved. 
                        {comparisonResult.summary.improved === 1 ? ' This parameter' : ' These parameters'} 
                        {' '}are now within normal range or better than before. Your treatment plan seems effective.
                      </p>
                    </div>
                  )}

                  {comparisonResult.summary.worsened > 0 && (
                    <div style={{ marginBottom: '15px', padding: '15px', background: '#fef2f2', borderRadius: '8px' }}>
                      <strong style={{ color: '#ef4444' }}>⚠️ Areas Needing Attention:</strong>
                      <p style={{ marginTop: '5px', fontSize: '14px', color: '#374151' }}>
                        {comparisonResult.summary.worsened} parameter(s) have worsened. 
                        Please discuss these changes with your healthcare provider.
                      </p>
                    </div>
                  )}

                  <div style={{ marginTop: '20px', padding: '15px', background: '#eff6ff', borderRadius: '8px' }}>
                    <strong style={{ color: '#2563eb' }}>📊 Summary:</strong>
                    <p style={{ marginTop: '5px', fontSize: '14px' }}>
                      Comparing report from <strong>{new Date(report1.reportDate).toLocaleDateString()}</strong> to {' '}
                      <strong>{new Date(report2.reportDate).toLocaleDateString()}</strong>:<br/>
                      • {comparisonResult.summary.improved} parameter{comparisonResult.summary.improved !== 1 ? 's' : ''} improved<br/>
                      • {comparisonResult.summary.worsened} parameter{comparisonResult.summary.worsened !== 1 ? 's' : ''} worsened<br/>
                      • {comparisonResult.summary.unchanged} parameter{comparisonResult.summary.unchanged !== 1 ? 's' : ''} remained stable
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportComparison;