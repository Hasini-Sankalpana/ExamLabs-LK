import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import axios from 'axios';
import './UserOverview.css';

// Importing libraries for generating reports
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Importing Chart components
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const UserOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMCQs: 0,
    totalEssayExams: 0,
    totalPDFs: 0,
    totalMarkingSchemes: 0,
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

  // Function to generate and download PDF report
  const downloadPdfReport = () => {
    const doc = new jsPDF();
    doc.text('Statistics Report', 20, 20);
    doc.text(`Total Users: ${stats.totalUsers}`, 20, 30);
    doc.text(`Total MCQs: ${stats.totalMCQs}`, 20, 40);
    doc.text(`Total Essay Quizes: ${stats.totalEssayExams}`, 20, 50);
    doc.text(`Total Papers: ${stats.totalPDFs}`, 20, 60);
    doc.text(`Total Marking Schemes: ${stats.totalMarkingSchemes}`, 20, 70);
    
    // Generate charts
    const chartContainer = document.querySelector('.chartjs-container');
    html2canvas(chartContainer).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 20, 80, 160, 90);
      doc.save('Statistics_Report.pdf');
    });
  };

  // Chart Data
  const barChartData = {
    labels: ['Total Users', 'Total MCQs', 'Total Essay Quizes', 'Total Papers', 'Total Marking Schemes'],
    datasets: [
      {
        label: 'Counts',
        data: [stats.totalUsers, stats.totalMCQs, stats.totalEssayExams, stats.totalPDFs, stats.totalMarkingSchemes],
        backgroundColor: 'rgb(115, 164, 225',
        borderColor: 'rgb(115, 164, 225',
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ['Total Users', 'Total MCQs', 'Total Essay Quizes', 'Total Papers', 'Total Marking Schemes'],
    datasets: [
      {
        label: 'Counts',
        data: [stats.totalUsers, stats.totalMCQs, stats.totalEssayExams, stats.totalPDFs, stats.totalMarkingSchemes],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="user">
      <div className='useroverview'>
        <AdminSidebar />
        <div className='stats-container'>
          <div className="stat-items">
            <ul>
              <li>
                <h3>Total Users</h3>
                <p>{stats.totalUsers}</p>
              </li>
              <li>
                <h3>MCQs</h3>
                <p>{stats.totalMCQs}</p>
              </li>
              <li>
                <h3>Essay Quizes</h3>
                <p>{stats.totalEssayExams}</p>
              </li>
              <li>
                <h3>Past Papers</h3>
                <p>{stats.totalPDFs}</p>
              </li>
              <li>
                <h3>Marking Schemes</h3>
                <p>{stats.totalMarkingSchemes}</p>
              </li>
            </ul>
          </div>
          <div className='chart-container'>
            <h3>Statistics Overview</h3>
            <div className='chartjs-container'>
              <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }} />
            </div>
          </div>
          <button onClick={downloadPdfReport}>Download PDF Report</button>
          <button onClick={downloadXlsxReport}>Download Excel Report</button>
        </div>
      </div>
    </div>
  );
};

export default UserOverview;
