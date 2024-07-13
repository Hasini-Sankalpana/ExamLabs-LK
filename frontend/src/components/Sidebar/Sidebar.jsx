import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const { token, setToken } = useContext(StoreContext);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");

  useEffect(() => {
  const storedToken = localStorage.getItem("token");

  const fetchProfilePicture = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/user/profile-picture', {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      });

      if (response.data.success) {
        setProfilePicture(response.data.profilePicture);
        localStorage.setItem('profilePicture', response.data.profilePicture);
      } else {
        console.log("Failed to fetch profile picture:", response.data.message);
        setProfilePicture(""); // Clear profile picture if fetch fails
        localStorage.removeItem('profilePicture'); // Remove from storage if fetch fails
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      setProfilePicture(""); // Clear profile picture on error
      localStorage.removeItem('profilePicture'); // Remove from storage on error
    }
  };

  if (storedToken) {
    fetchProfilePicture();
  } else {
    setProfilePicture(""); // Clear profile picture if no token
    localStorage.removeItem('profilePicture'); // Remove from storage if no token
  }
}, [setToken]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profilePicture");
    setProfilePicture(""); 
    setToken("");
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <link
        href="https://cdn.jsdelivr.net/npm/remixicon@4.0.0/fonts/remixicon.css"
        rel="stylesheet" />
      <div className="sidebar-header">
        <h2>Student Dashboard </h2>
        <i className={`ri-align-justify ${isCollapsed ? 'collapsed' : ''}`} onClick={toggleSidebar}></i>
      </div>
      <img src={profilePicture} />
      <ul>
        <NavLink to='/dashboard' className='sidebar-option'>
          <li><i className="ri-dashboard-fill"></i> {!isCollapsed && 'Dashboard'}</li>
        </NavLink>
        <NavLink to='/exams' className='sidebar-option'>
          <li><i className="ri-book-3-fill"></i> {!isCollapsed && 'Exams'}</li>
        </NavLink>
        <NavLink to='/favorites' className='sidebar-option'>
          <li><i className="ri-heart-add-fill"></i> {!isCollapsed && 'Favorites'}</li>
        </NavLink>
        <NavLink to='/settings' className='sidebar-option'>
          <li><i className="ri-user-settings-fill"></i> {!isCollapsed && 'Settings'}</li>
        </NavLink>
      </ul>
      <button onClick={logout} className="logout">{!isCollapsed && 'Log Out'}</button>
    </div>
  );
}

export default Sidebar;