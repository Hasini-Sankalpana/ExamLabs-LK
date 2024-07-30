import React from 'react';
import './Header.css';
import user_img from '../../assets/user_header.png';
import { useNavigate } from 'react-router-dom';

const Header = ({ token, setShowLogin }) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (token) {
      // If user is logged in, navigate to the dashboard
      navigate('/dashboard');
    } else {
      // If user is not logged in, show the login popup
      setShowLogin(true);
    }
  };

  return (
    <div className='header'>
      <div className="header-contents">
        <h2>Practicing past papers has never been easier</h2>
        <p>Practice official past papers from GCE,cambridge,Edexel,AQA,OCR etc and practice <br /> over 10000 high quality questions.</p>
        <button onClick={handleGetStarted}>Get Started </button>
      </div>
     
    </div>
  )
}

export default Header;
