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
       const [dropdownVisible, setDropdownVisible] = useState(false);

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

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

       
  return (
    <div className='navbar' id='navbar'>
          <link
    href="https://cdn.jsdelivr.net/npm/remixicon@4.0.0/fonts/remixicon.css"
    rel="stylesheet"/>
               <Link to='/'><h2>ExamLabs LK <i className="ri-book-open-fill"></i></h2></Link>  

            <ul className="navlist" >
                <Link to='/'><li onClick={() =>setMenu("Home")} className={menu == "Home"?"active":""}>Home</li></Link>
                <Link to='/subjects'><li onClick={() =>setMenu("Subjects")} className={menu == "Subjects"?"active":""}>Subjects</li></Link>
                <Link to='/aboutus'><li onClick={() =>setMenu("About")} className={menu == "About"?"active":""}>About</li></Link>
                <Link to='/contact'><li onClick={() =>setMenu("Contact")} className={menu == "Contact"?"active":""}>Contact</li></Link>
            </ul>
       
            {!token?  <button onClick={() => setShowLogin(true)}>Sign In</button>  
            :<div className='navbar-profile'>
            <img src={profilePicture} alt=""  className="profile-picture"/>
            <i className="ri-menu-line hamburger-icon" onClick={toggleDropdown}></i>
                    {dropdownVisible && (
                        <ul className='nav-profile-dropdown'>
                            <li onClick={() => { navigate('/dashboard'); toggleDropdown(); }}><p>Dashboard</p></li>
                            <hr />
                            <li onClick={() => { navigate('/exams'); toggleDropdown(); }}><p>Exams</p></li>
                            <hr />
                            <li onClick={() => { logout(); toggleDropdown(); }}><p>Logout</p></li>
                        </ul>
                    )}
         </div>
         
         }

                 
            


    </div>
  )
}

export default Navbar