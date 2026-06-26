import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const ReportDetail = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      // Backend se report fetch karo (public API banana hoga)
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/reports/public/${id}`);
      setReport(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
      setError('Report not found or inaccessible');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f5f5f5' }}>
        <div className="spinner"></div>
        <p style={{ marginLeft: '10px' }}>Loading report...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f5f5f5' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '10px', textAlign: 'center', maxWidth: '400px' }}>
          <h2 style={{ color: '#ef4444', marginBottom: '15px' }}>Report Not Found</h2>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>{error || "The report you're looking for doesn't exist."}</p>
          <a href="/" style={{ textDecoration: 'none' }}>
            <button style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
              Go to Home
            </button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '20px' }}>
      {/* Header */}
      <div style={{ background: 'white', borderRadius: '10px', padding: '20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🏥</span>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>HealthMate - Shared Report</span>
        </div>
        <a href="/" style={{ textDecoration: 'none' }}>
          <button style={{ background: '#2563eb', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}>
            Go to App
          </button>
        </a>
      </div>

      {/* Report Card */}
      <div style={{ background: 'white', borderRadius: '10px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '5px' }}>{report.title}</h1>
          <div style={{ display: 'flex', gap: '15px', color: '#64748b', fontSize: '14px' }}>
            <span>Type: {report.reportType?.replace('_', ' ').toUpperCase()}</span>
            <span>Date: {new Date(report.reportDate).toLocaleDateString()}</span>
            <span className={`risk-badge risk-${report.riskLevel}`} style={{ background: report.riskLevel === 'high' ? '#ef4444' : report.riskLevel === 'medium' ? '#f59e0b' : '#10b981', color: 'white', padding: '2px 10px', borderRadius: '12px' }}>
              {report.riskLevel?.toUpperCase()} RISK
            </span>
          </div>
        </div>

        {/* File Preview */}
        {report.fileUrl && (
          <div style={{ marginBottom: '25px', padding: '20px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
            <p style={{ marginBottom: '10px', color: '#2563eb', fontWeight: '600' }}>
              📎 Attached Report File
            </p>
            {report.fileType === 'pdf' ? (
              <embed src={report.fileUrl} type="application/pdf" width="100%" height="600px" style={{ borderRadius: '8px' }} />
            ) : (
              <img src={report.fileUrl} alt="Report" style={{ maxWidth: '100%', maxHeight: '500px', borderRadius: '8px' }} />
            )}
          </div>
        )}

        {/* AI Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
          <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>📝 English Summary</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.5' }}>{report.aiSummary?.english || 'No summary available'}</p>
          </div>
          <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>📝 Urdu Summary</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.5' }}>{report.aiSummary?.urdu || 'کوئی خلاصہ دستیاب نہیں'}</p>
          </div>
        </div>

        {/* Abnormal Values */}
        {report.abnormalValues && report.abnormalValues.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>⚠️ Abnormal Values</h3>
            <div style={{ display: 'grid', gap: '8px' }}>
              {report.abnormalValues.map((item, i) => (
                <div key={i} style={{ padding: '10px', background: 'rgba(239,68,68,0.1)', borderRadius: '6px' }}>
                  <strong style={{ color: '#ef4444' }}>{item.parameter}:</strong> {item.value} (normal: {item.normalRange})
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>{item.significance}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dietary Advice */}
        {report.dietaryAdvice && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div style={{ padding: '15px', background: 'rgba(16,185,129,0.05)', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>✅ Recommended Foods</h3>
              <ul style={{ paddingLeft: '20px' }}>
                {report.dietaryAdvice.recommended?.map((food, i) => <li key={i}>{food}</li>)}
              </ul>
            </div>
            <div style={{ padding: '15px', background: 'rgba(239,68,68,0.05)', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>🚫 Foods to Avoid</h3>
              <ul style={{ paddingLeft: '20px' }}>
                {report.dietaryAdvice.avoid?.map((food, i) => <li key={i}>{food}</li>)}
              </ul>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div style={{ marginTop: '20px', padding: '15px', background: '#eff6ff', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '12px' }}>
            This report was shared via HealthMate. For medical advice, please consult your doctor.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;