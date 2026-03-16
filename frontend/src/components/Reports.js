import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { sendReportEmail } from '../services/emailService.js';

// Timeline Chart Component
const TimelineChart = ({ data }) => {
  if (data.length === 0) return null;
  
  return (
    <div style={{ marginTop: '20px', padding: '20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(month => (
          <span key={month} style={{ fontSize: '11px', color: '#64748b' }}>{month}</span>
        ))}
      </div>
      <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', position: 'relative' }}>
        {data.map((report, index) => {
          const left = (new Date(report.reportDate).getMonth() / 11) * 100;
          return (
            <div
              key={report._id}
              style={{
                position: 'absolute',
                left: `${left}%`,
                top: '-6px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: report.riskLevel === 'high' ? '#ef4444' : report.riskLevel === 'medium' ? '#f59e0b' : '#10b981',
                border: '2px solid white',
                cursor: 'pointer'
              }}
              title={report.title}
            />
          );
        })}
      </div>
    </div>
  );
};

// PDF Preview Component
const PDFPreview = ({ fileUrl }) => {
  const [showPreview, setShowPreview] = useState(false);
  
  if (!fileUrl) return null;
  
  return (
    <>
      <button
        onClick={() => setShowPreview(true)}
        style={{
          background: 'none',
          border: '1px solid #e2e8f0',
          padding: '6px 12px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}
      >
        📄 Preview
      </button>
      
      {showPreview && (
        <div className="modal-overlay" onClick={() => setShowPreview(false)}>
          <div className="modal" style={{ maxWidth: '800px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Report Preview</h2>
              <button className="modal-close" onClick={() => setShowPreview(false)}>×</button>
            </div>
            <div className="modal-body">
              {fileUrl.includes('pdf') ? (
                <embed src={fileUrl} type="application/pdf" width="100%" height="500px" />
              ) : (
                <img src={fileUrl} alt="Report" style={{ maxWidth: '100%', maxHeight: '500px' }} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Reports = () => {
  const { user, logout } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [shareModal, setShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    reportType: 'blood_test',
    reportDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/reports`);
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Failed to load reports. Please refresh the page.');
    }
    setLoading(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File too large! Max 10MB');
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!formData.title) {
        setError('Please enter a report title');
        setUploading(false);
        return;
      }

      if (!editingReport && !selectedFile) {
        setError('Please select a file to upload');
        setUploading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('reportType', formData.reportType);
      formDataToSend.append('reportDate', formData.reportDate);
      
      if (selectedFile) {
        formDataToSend.append('file', selectedFile);
      }

      let response;
      if (editingReport) {
        // Update existing report
        response = await axios.put(
          `${process.env.REACT_APP_API_URL}/reports/${editingReport._id}`,
          formDataToSend,
          { 
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 30000 // 30 seconds timeout
          }
        );
        setReports(reports.map(r => r._id === editingReport._id ? response.data.report : r));
        setSuccess('Report updated successfully!');
      } else {
        // Add new report
        response = await axios.post(
          `${process.env.REACT_APP_API_URL}/reports/upload`,
          formDataToSend,
          { 
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 30000
          }
        );
        setReports([response.data.report, ...reports]);
        setSuccess('Report uploaded successfully!');
      }
      
      // Close modal and reset form after 2 seconds
      setTimeout(() => {
        setShowAddModal(false);
        setEditingReport(null);
        resetForm();
        setSuccess('');
      }, 2000);
      
    } catch (error) {
      console.error('Error saving report:', error);
      if (error.code === 'ECONNABORTED') {
        setError('Request timeout. Please try again.');
      } else if (error.response) {
        setError(error.response.data.message || 'Error saving report. Please try again.');
      } else if (error.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('Error saving report. Please try again.');
      }
    }
    setUploading(false);
  };

  const deleteReport = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/reports/${reportId}`);
        setReports(reports.filter(r => r._id !== reportId));
        setSuccess('Report deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        console.error('Error deleting report:', error);
        setError('Error deleting report. Please try again.');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const editReport = (report) => {
    setEditingReport(report);
    setFormData({
      title: report.title,
      reportType: report.reportType,
      reportDate: new Date(report.reportDate).toISOString().split('T')[0]
    });
    setSelectedFile(null);
    setShowAddModal(true);
    setError('');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      reportType: 'blood_test',
      reportDate: new Date().toISOString().split('T')[0]
    });
    setSelectedFile(null);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const downloadReport = (report) => {
    if (report.fileUrl) {
      window.open(report.fileUrl, '_blank');
    }
  };

  const shareReport = (report) => {
    setSelectedReport(report);
    setShareModal(true);
  };

const handleShare = async () => {
  if (!shareEmail) {
    alert('Please enter an email address');
    return;
  }
  
  setUploading(true);
  setError('');
  setSuccess('');
  
  try {
    // Report detail page ka link bhejo
    const reportLink = window.location.origin + `/report/${selectedReport._id}`;
    
    await sendReportEmail(
      shareEmail, 
      selectedReport.title, 
      selectedReport,
      reportLink  // 👈 YEH NAYA PARAMETER
    );
    
    setSuccess(`✅ Report shared successfully with ${shareEmail}`);
    setShareModal(false);
    setShareEmail('');
    setSelectedReport(null);
    setTimeout(() => setSuccess(''), 5000);
  } catch (error) {
    console.error('Share error:', error);
    setError(error.message || 'Failed to share report');
    setTimeout(() => setError(''), 5000);
  }
  setUploading(false);
};

  const compareReports = () => {
  if (reports.length < 2) {
    setError('Need at least 2 reports to compare');
    setTimeout(() => setError(''), 3000);
    return;
  }
  // Navigate to compare page
  window.location.href = '/report-comparison';
};

  // Filter reports based on search and type
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reportType?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || report.reportType === filterType;
    return matchesSearch && matchesType;
  });

  // Statistics
  const totalReports = reports.length;
  const highRiskCount = reports.filter(r => r.riskLevel === 'high').length;
  const thisMonthCount = reports.filter(r => 
    new Date(r.reportDate).getMonth() === new Date().getMonth()
  ).length;

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
        {/* Header with Stats */}
        <div className="reports-header">
          <div>
            <h1 className="dashboard-title">Medical Reports</h1>
            <p className="dashboard-subtitle">Manage and analyze your medical reports with AI insights</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={compareReports} className="btn btn-outline">
              📊 Compare Reports
            </button>
            <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
              📄 Add New Report
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '20px' }}>
            {error}
          </div>
        )}
        
        {success && (
          <div className="alert alert-success" style={{ marginBottom: '20px' }}>
            {success}
          </div>
        )}

        {/* Stats Cards */}
        <div className="stats-grid" style={{ marginBottom: '25px' }}>
          <div className="stat-card fade-in">
            <div className="stat-header">
              <div className="stat-icon reports">📋</div>
            </div>
            <div className="stat-title">Total Reports</div>
            <div className="stat-number">{totalReports}</div>
          </div>

          <div className="stat-card fade-in">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>⚠️</div>
            </div>
            <div className="stat-title">High Risk Reports</div>
            <div className="stat-number" style={{ color: highRiskCount > 0 ? '#ef4444' : '#10b981' }}>
              {highRiskCount}
            </div>
          </div>

          <div className="stat-card fade-in">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>📅</div>
            </div>
            <div className="stat-title">This Month</div>
            <div className="stat-number">{thisMonthCount}</div>
          </div>

          <div className="stat-card fade-in">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>📊</div>
            </div>
            <div className="stat-title">Completion</div>
            <div className="stat-number">{Math.min(Math.round((reports.length / 10) * 100), 100)}%</div>
          </div>
        </div>

        {/* Timeline View */}
        {reports.length > 0 && (
          <div className="chart-card fade-in" style={{ marginBottom: '25px' }}>
            <div className="chart-header">
              <h3 className="chart-title">Report Timeline</h3>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Last 6 months</span>
            </div>
            <TimelineChart data={reports} />
          </div>
        )}

        {/* Search and Filter */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }}>🔍</span>
            <input
              type="text"
              placeholder="Search reports by title or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '14px'
              }}
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: '12px',
              border: '2px solid #e2e8f0',
              borderRadius: '10px',
              fontSize: '14px'
            }}
          >
            <option value="all">All Types</option>
            <option value="blood_test">Blood Test</option>
            <option value="xray">X-Ray</option>
            <option value="mri">MRI</option>
            <option value="ultrasound">Ultrasound</option>
            <option value="ecg">ECG</option>
          </select>
        </div>

        {loading ? (
          <div className="loading-screen">
            <div className="spinner"></div>
            <p>Loading your reports...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="chart-card text-center">
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📋</div>
            <h2 style={{ marginBottom: '10px' }}>No Reports Found</h2>
            <p style={{ color: '#64748b', marginBottom: '30px' }}>
              {searchTerm ? 'No reports match your search' : 'Add your first medical report to get AI-powered insights'}
            </p>
            {!searchTerm && (
              <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ width: 'auto' }}>
                📄 Add Your First Report
              </button>
            )}
          </div>
        ) : (
          <div className="reports-grid">
            {filteredReports.map(report => (
              <div key={report._id} className="report-card fade-in">
                <div className="report-header">
                  <div>
                    <h3 className="report-title">{report.title}</h3>
                    <div className="report-meta">
                      <span>📁 {report.reportType?.replace('_', ' ').toUpperCase() || 'Unknown'}</span>
                      <span>📅 {new Date(report.reportDate).toLocaleDateString('en-US', { 
                        year: 'numeric', month: 'short', day: 'numeric' 
                      })}</span>
                      <span className={`risk-badge risk-${report.riskLevel || 'low'}`}>
                        {(report.riskLevel || 'low').toUpperCase()} RISK
                      </span>
                    </div>
                  </div>
                  <div className="report-actions">
                    {report.fileUrl && <PDFPreview fileUrl={report.fileUrl} />}
                    <button onClick={() => downloadReport(report)} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>
                      ⬇️
                    </button>
                    <button onClick={() => shareReport(report)} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>
                      📧
                    </button>
                    <button onClick={() => editReport(report)} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>
                      ✏️
                    </button>
                    <button onClick={() => deleteReport(report._id)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }}>
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="report-summary">
                  {/* AI Summary Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                      <div className="summary-title">📝 English Summary</div>
                      <p style={{ fontSize: '13px', lineHeight: '1.5', marginTop: '5px' }}>{report.aiSummary?.english || 'No summary available'}</p>
                    </div>
                    
                    <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', fontFamily: 'system-ui' }}>
                      <div className="summary-title">📝 Urdu Summary</div>
                      <p style={{ fontSize: '13px', lineHeight: '1.5', marginTop: '5px' }}>{report.aiSummary?.urdu || 'کوئی خلاصہ دستیاب نہیں'}</p>
                    </div>
                  </div>

                  {/* Abnormal Values Grid */}
                  {report.abnormalValues && report.abnormalValues.length > 0 && (
                    <div style={{ marginBottom: '15px' }}>
                      <div className="summary-title" style={{ marginBottom: '10px' }}>⚠️ Abnormal Values</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                        {report.abnormalValues.map((abnormal, index) => (
                          <div key={index} style={{ 
                            padding: '10px', 
                            background: 'rgba(239, 68, 68, 0.1)',
                            borderRadius: '8px',
                            fontSize: '13px'
                          }}>
                            <strong style={{ color: '#ef4444' }}>{abnormal.parameter}:</strong>
                            <div>{abnormal.value} <span style={{ color: '#64748b' }}>(normal: {abnormal.normalRange})</span></div>
                            <div style={{ fontSize: '11px', marginTop: '4px' }}>{abnormal.significance}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Health Advice Cards */}
                  {report.dietaryAdvice && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                      <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px' }}>
                        <div className="summary-title">✅ Recommended Foods</div>
                        <ul style={{ fontSize: '12px', marginTop: '8px', paddingLeft: '20px' }}>
                          {(report.dietaryAdvice?.recommended || []).map((food, i) => (
                            <li key={i}>{food}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px' }}>
                        <div className="summary-title">🚫 Foods to Avoid</div>
                        <ul style={{ fontSize: '12px', marginTop: '8px', paddingLeft: '20px' }}>
                          {(report.dietaryAdvice?.avoid || []).map((food, i) => (
                            <li key={i}>{food}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Questions & Remedies */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    {report.doctorQuestions && report.doctorQuestions.length > 0 && (
                      <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                        <div className="summary-title">❓ Questions for Doctor</div>
                        <ul style={{ fontSize: '12px', marginTop: '8px', paddingLeft: '20px' }}>
                          {report.doctorQuestions.map((q, i) => (
                            <li key={i}>{q}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {report.homeRemedies && report.homeRemedies.length > 0 && (
                      <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                        <div className="summary-title">🏠 Home Remedies</div>
                        <ul style={{ fontSize: '12px', marginTop: '8px', paddingLeft: '20px' }}>
                          {report.homeRemedies.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div style={{ marginTop: '15px', padding: '15px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', color: 'white' }}>
                  <div className="summary-title" style={{ color: 'white' }}>💡 AI Health Insight</div>
                  <p style={{ fontSize: '13px', marginTop: '5px', opacity: 0.9 }}>
                    Based on this report, we recommend scheduling a follow-up with your doctor within {report.riskLevel === 'high' ? '7' : report.riskLevel === 'medium' ? '14' : '30'} days.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2 className="modal-title">{editingReport ? 'Edit Report' : 'Add New Report'}</h2>
                <button className="modal-close" onClick={() => { setShowAddModal(false); setEditingReport(null); resetForm(); }}>×</button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Report Title *</label>
                    <input 
                      type="text" 
                      name="title" 
                      value={formData.title} 
                      onChange={handleInputChange} 
                      placeholder="e.g., Blood Test Report" 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Report Type</label>
                    <select 
                      name="reportType" 
                      value={formData.reportType} 
                      onChange={handleInputChange} 
                      style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '10px' }}
                    >
                      <option value="blood_test">Blood Test</option>
                      <option value="xray">X-Ray</option>
                      <option value="mri">MRI Scan</option>
                      <option value="ultrasound">Ultrasound</option>
                      <option value="ecg">ECG</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Report Date</label>
                    <input 
                      type="date" 
                      name="reportDate" 
                      value={formData.reportDate} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>

                  {!editingReport && (
                    <div className="form-group">
                      <label>Upload Report File *</label>
                      <div 
                        className="file-upload" 
                        onClick={() => document.getElementById('fileInput').click()}
                        style={{ border: selectedFile ? '2px solid #10b981' : '2px dashed #e2e8f0' }}
                      >
                        <div className="upload-icon">📎</div>
                        <p style={{ fontWeight: '600' }}>
                          {selectedFile ? `✅ ${selectedFile.name}` : 'Click to upload PDF or Image'}
                        </p>
                        <p style={{ color: '#64748b', fontSize: '14px' }}>
                          Supports PDF, JPG, PNG (Max 10MB)
                        </p>
                        <input 
                          id="fileInput" 
                          type="file" 
                          accept=".pdf,.jpg,.jpeg,.png" 
                          onChange={handleFileSelect} 
                          required={!editingReport}
                        />
                      </div>
                      {selectedFile && (
                        <div style={{ 
                          marginTop: '10px', 
                          padding: '8px', 
                          background: '#f0fdf4', 
                          border: '1px solid #bbf7d0',
                          borderRadius: '6px',
                          fontSize: '12px',
                          color: '#166534'
                        }}>
                          ✅ File selected: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-10">
                    <button 
                      type="button" 
                      className="btn btn-outline" 
                      onClick={() => { setShowAddModal(false); setEditingReport(null); resetForm(); }} 
                      style={{ flex: 1 }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      disabled={uploading} 
                      style={{ flex: 1 }}
                    >
                      {uploading ? (
                        <>
                          <div className="spinner" style={{width: '16px', height: '16px', borderWidth: '2px'}}></div>
                          {editingReport ? 'Updating...' : 'Uploading...'}
                        </>
                      ) : (
                        editingReport ? 'Update Report' : 'Upload Report'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {shareModal && (
          <div className="modal-overlay" onClick={() => setShareModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Share Report</h2>
                <button className="modal-close" onClick={() => setShareModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <p style={{ marginBottom: '15px' }}>Share "{selectedReport?.title}" with:</p>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px', marginBottom: '15px' }}
                />
                <div className="flex gap-10">
                  <button onClick={() => setShareModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                  <button 
                    onClick={handleShare} 
                    className="btn btn-primary" 
                    style={{ flex: 1 }}
                    disabled={uploading}
                  >
                    {uploading ? 'Sending...' : 'Share Report'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;