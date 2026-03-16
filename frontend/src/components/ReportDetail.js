import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const ReportDetail = () => {
  const { user, logout } = useAuth();
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/reports/${id}`);
      setReport(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading report...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="reports-container">
        <div className="chart-card text-center">
          <h2>Report Not Found</h2>
          <p>The report you're looking for doesn't exist or you don't have permission to view it.</p>
          <Link to="/reports">
            <button className="btn btn-primary">Back to Reports</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <nav className="navbar">
        <Link to="/dashboard" className="nav-brand">🏥 HealthMate</Link>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/reports">Reports</Link>
          <Link to="/vitals">Vitals</Link>
        </div>
        <div className="user-menu">
          <span>Hello, {user?.name}!</span>
          <button onClick={logout} className="btn btn-outline">Logout</button>
        </div>
      </nav>

      <div className="reports-container">
        {/* Report details here - same as Reports.js ka display */}
        {/* Copy wahi JSX jo Reports mein report card ke andar hai */}
      </div>
    </div>
  );
};

export default ReportDetail;