
import React, { useContext, useEffect, useState } from 'react';
import './Navbar.css';
import {useNavigate} from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';

const Navbar = () => {
  const {token,setToken } = useContext(StoreContext);
  const [profilePicture, setProfilePicture] = useState(""); // Default profile picture

       const navigate = useNavigate();
   
       useEffect(() => {
           const fetchProfilePicture = async () => {
               try {
                   const response = await axios.get('http://localhost:4000/api/admin/profile-picture', {
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
   
           if (token) {
               fetchProfilePicture();
           }
       }, [token]);

       
//logout
    const logout = () => {
         localStorage.removeItem("token");
         setToken("");
         navigate("/");
    }
  return (
    <div className='navbar'>
      <link
    href="https://cdn.jsdelivr.net/npm/remixicon@4.0.0/fonts/remixicon.css"
    rel="stylesheet"/>
             <h2>ExamLabs LK <i className="ri-book-open-fill"></i></h2> 
             {!token? " " : <div className='navbar-profile'>
    <img src={profilePicture} alt=""  className="profile-picture"/>
    </div>}
    </div>
   
  )
}

export default Navbar;