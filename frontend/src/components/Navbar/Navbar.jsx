import React, { useContext, useEffect, useState } from 'react';
import './Navbar.css';
import profile_icon from '../../assets/profile_icon.png';
import {Link, useNavigate} from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const Navbar = ({setShowLogin}) => {
   //add underline property for navlist
       const [menu, setMenu] = useState("Home");
       const {token,setToken } = useContext(StoreContext);
       const [profilePicture, setProfilePicture] = useState(""); // Default profile picture
       const [papersDropdown, setPapersDropdown] = useState(false);

       const navigate = useNavigate();
   
       useEffect(() => {
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
    <div className='navbar' id='navbar'>
          <link
    href="https://cdn.jsdelivr.net/npm/remixicon@4.0.0/fonts/remixicon.css"
    rel="stylesheet"/>
               <Link to='/'><h2>ExamLabs LK <i className="ri-book-open-fill"></i></h2></Link>  

            <ul className="navlist" >
                <Link to='/'><li onClick={() =>setMenu("Home")} className={menu == "Home"?"active":""}>Home</li></Link>
                <a href='#subjects' onClick={() =>setMenu("Subjects")} className={menu == "Subjects"?"active":""}>Subjects</a>
                <div className="dropdown">
                   <a href='#' onClick={() => setPapersDropdown(!papersDropdown)} className={menu === "Papers" ? "active" : ""}>
                       Papers <i className="ri-arrow-down-s-line"></i>
                   </a>
                   {papersDropdown && (
                       <div className="dropdown-content">
                           <li onClick={() => navigate('/all-papers')}><p>Past Papers</p></li>
                           <li onClick={() => navigate('/marking-schemes')}><p>Marking Schemes</p></li>
                       </div>
                   )}
               </div>
                <a href='#about-content' onClick={() =>setMenu("About")} className={menu == "About"?"active":""}>About</a>
                 <a href='#footer' onClick={() =>setMenu("Contact")} className={menu == "Contact"?"active":""}>Contact</a>
            </ul>
       
            {!token?  <button onClick={() => setShowLogin(true)}>Sign In</button>  
            :<div className='navbar-profile'>
            <img src={profilePicture} alt=""  className="profile-picture"/>
            <ul className='nav-profile-dropdown'>
             <li onClick={() => navigate('/dashboard')}><p>Dashboard</p></li>
             <hr />
             <li onClick={() => navigate('/exams')}><p>Exams</p></li>
             <hr />
             <li onClick={logout}><p>Logout</p></li>
            </ul>
         </div>
         
         }

                 
            


    </div>
  )
}

export default Navbar