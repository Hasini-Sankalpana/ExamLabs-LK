import React, { useContext }  from 'react';
import { NavLink} from 'react-router-dom';
import './AdminSidebar.css';
import {useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';


const AdminSidebar = () => {
  
  const navigate = useNavigate();
  const { token, setToken } = useContext(StoreContext);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };


  return (
    <div className="sidebar">
      <link
        href="https://cdn.jsdelivr.net/npm/remixicon@4.0.0/fonts/remixicon.css"
        rel="stylesheet" />
         <div className="sidebar-options">
        <ul>
        <NavLink to='/UserOverview' className='sidebar-option'>
        <i className="ri-line-chart-line"></i>
          <li> User Overview</li>
          </NavLink>
        <NavLink to='/add' className='sidebar-option'>
        <i className="ri-folder-add-line"></i>
          <li>Add Papers</li>
          </NavLink>
       
         <NavLink to='/list' className='sidebar-option'>
         <i className="ri-gallery-view-2"></i>
          <li>View Uploads</li>
          </NavLink>
     
          
        </ul>
        <button onClick={logout} className="logout">Log Out</button>
        </div>
    </div>
  );
}

export default AdminSidebar;
