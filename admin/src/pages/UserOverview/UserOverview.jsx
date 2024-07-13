import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import axios from 'axios';
import './UserOverview.css';

// Importing libraries for generating reports
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const UserOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMCQs: 0,
    totalEssayExams: 0,
    totalPDFs: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/admin/statistics');
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStats();
  }, []);

  
  // Function to generate and download XLSX report
  const downloadXlsxReport = () => {
    const data = [
      ['Category', 'Count'],
      ['Total Users', stats.totalUsers],
      ['Total MCQs', stats.totalMCQs],
      ['Total Essay Quizes', stats.totalEssayExams],
      ['Total Papers', stats.totalPDFs],
      ['Total Marking Schemes', stats.totalMarkingSchemes],
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Statistics_Report');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, 'Statistics_Report.xlsx');
  };

  return (
    <div className='useroverview'>
      <AdminSidebar />
      <div className='stats-container'>
        <div className='stat-item-user'>
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className='stat-item'>
          <h3>Total MCQs</h3>
          <p>{stats.totalMCQs}</p>
        </div>
        <div className='stat-item'>
          <h3>Total Essay Quizes</h3>
          <p>{stats.totalEssayExams}</p>
        </div>
        <div className='stat-item'>
          <h3>Total Papers</h3>
          <p>{stats.totalPDFs}</p>
        </div>
        <div className='stat-item'>
          <h3>Total Marking Schemes</h3>
          <p>{stats.totalMarkingSchemes}</p>
        </div>
        <div className='download-buttons'>
          <button onClick={downloadXlsxReport}>Download Report</button>
        </div>
      </div>
    </div>
  );
}

export default UserOverview;