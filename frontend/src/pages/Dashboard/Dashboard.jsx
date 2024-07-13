import React, { useContext, useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Dashboard.css';
import paper_thumbnail from '../../assets/paper-thumbnail.png';
import axios from 'axios';

const Dashboard = () => {

  const [examScores, setExamScores] = useState([]);
  const [profilePicture, setProfilePicture] = useState("");

 /* useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchProfilePicture = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/user/profile-picture', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setProfilePicture(response.data.profilePicture);
        } else {
          console.log("Failed to fetch profile picture:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };

    fetchProfilePicture();
  },[]);*/

  useEffect(() => {
    const fetchExamScores = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:4000/api/user/exam-scores", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setExamScores(response.data.examScores);
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

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <div className="dashboard-top">
          <div className="user-info">
            <div>
            <h2>{userInfo.name}</h2>
            <p>{userInfo.email}</p>
            </div>
          </div>
        </div>
        <div className={`completed-papers ${examScores.length === 0 ? 'short' : ''}`}>
          <h3>Completed Past Papers</h3>
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
                <button onClick={() => alert(`Score: ${score.score}`)}>View Results</button>
              </div>
            ))
          )}
        </div>
        <div className="statistics">
          <div className="stat">
            <h3>No. of Completions</h3>
            <p>{examScores.length} Papers</p>
          </div>
          <div className="stat">
            <h3>No. of Downloads</h3>
            <p>12 Papers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
