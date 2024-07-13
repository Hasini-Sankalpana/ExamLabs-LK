import React from 'react';
import './Footer.css';
import facebook_icon from '../../assets/facebook_icon.png';
import twitter_icon from '../../assets/twitter_icon.png';
import linkedin_icon from '../../assets/linkedin_icon.png';
import { Link } from 'react-router-dom';



const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
            <link
    href="https://cdn.jsdelivr.net/npm/remixicon@4.0.0/fonts/remixicon.css"
    rel="stylesheet"/>
         <h2>ExamLabs LK <i className="ri-book-open-line"></i></h2>
         <p>Unlock Your Potential with ExamLabs LK <br />Mastering Past Papers Made Easy.</p>
         <div className="footer-social-icons">
        <img src={facebook_icon} alt="" />
        <img src={twitter_icon} alt="" />
        <img src={linkedin_icon} alt="" />

         </div>
            </div>
            <div className="footer-content-center">
                <h2>COMPANY</h2>
                <ul>
                    <li><a href='/'>Home</a></li>
                    <li> <a href='#about-content'>About Us</a></li>
                    <li><Link to="/all-papers">Papers</Link></li>
                    <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                </ul>
            </div>
            <div className="footer-content-right">
                <h2>GET IN TOUCH</h2>
                <ul>
                    <li>0112500500</li>
                    <li>Contact@ExamLabslk.com</li>
                </ul>
            </div>
            
        </div>
      <hr />
      <p className="footer-copyright">Copyright 2024 © ExamLabslk.com - All Right Reserved.</p>
    </div>
  )
}

export default Footer