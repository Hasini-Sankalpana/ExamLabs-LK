import React, { useContext, useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Dashboard.css';
import paper_thumbnail from '../../assets/paper-thumbnail.png';
import student from '../../assets/student.png';
import complete from '../../assets/complete.png';
import axios from 'axios';
import ViewResultPopup from '../../components/ViewResultPopup/ViewResultPopup';
import { StoreContext } from '../../context/StoreContext';

const Dashboard = () => {
  const [examScores, setExamScores] = useState([]);
  const [profilePicture, setProfilePicture] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedScore, setSelectedScore] = useState(null);

  useEffect(() => {
    const fetchExamScores = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:4000/api/user/exam-scores", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setExamScores(response.data.examScores.reverse());
      } catch (error) {
        console.error("Error fetching exam scores:", error);
      }
    };

    fetchExamScores();
  }, []);

  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:4000/api/user/info", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserInfo(response.data.user);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleViewResults = (score) => {
    setSelectedScore(score);
    setShowPopup(true);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <div className="dashboard-top">
          <div className="user-info">
            <img src={student} alt="User" />
            <div>
              <h2>{userInfo.name}</h2>
              <p>{userInfo.email}</p>
            </div>
          </div>
        </div>
        <div className={`completed-papers ${examScores.length === 0 ? 'short' : ''}`}>
          <h3>Completed Past Papers</h3>
          <div className="com-past">
          {examScores.length === 0 ? (
            <p>No completed papers yet.</p>
          ) : (
            examScores.map((score, index) => (
              <div className="paper" key={index}>
                <div className="info">
                  <img src={paper_thumbnail} alt="Paper" />
                  <div>
                    <h4>{score.examName}</h4>
                    <p>GCE Ordinary Level 2024</p>
                  </div>
                </div>
                <button onClick={() => handleViewResults(score.score)}>View Results</button>
              </div>
            ))
          )}
          </div>
        </div>
        <div className="statistics">
          <div className="stat">
            <div className="stat-info">
              <h3>No. of Completions</h3>
              <p>{examScores.length} Papers</p>
            </div>
            <div className="stat-img">
              <img src={complete} alt="Completed" />
            </div>
          </div>
        </div>
      </div>
      <ViewResultPopup show={showPopup} onClose={() => setShowPopup(false)} score={selectedScore} />
    </div>
  );
}

export default Dashboard;
