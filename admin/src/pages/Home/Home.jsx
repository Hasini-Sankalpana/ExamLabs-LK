import React, { useContext, useState, useEffect } from 'react';
import './Home.css';
import admin_img from '../../assets/admin_header.png';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { auth, provider } from '../../../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { url, token, setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState('Sign In');
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    defaultphoto: "https://freesvg.org/img/abstract-user-flat-4.png"
  });

  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    if (currState === 'Sign In') {
      newUrl += '/api/admin/login';
    } else {
      newUrl += '/api/admin/register';
    }

    const response = await axios.post(newUrl, data);

    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      navigate('/add');
    } else {
      alert(response.data.message);
    }
  };

  const googleSignIn = async () => {
    try {
      provider.setCustomParameters({
        prompt: 'select_account',
        hl: 'en'
      });

      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const response = await axios.post(`${url}/api/admin/google`, {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL
      });

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        navigate('/UserOverview');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };

  useEffect(() => {
    // Check if the token exists in local storage
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, [setToken]);

  return (
    <div className='home'>
      {token ? (
        <div className="dashboard-button-container">
          <button onClick={() => navigate('/UserOverview')}>Go to Dashboard</button>
        </div>
      ) : (
        <div className="login-popup">
          <form onSubmit={onLogin} className="login-popup-container">
            <div className="login-popup-title">
              <h2>{currState}</h2>
            </div>
            <div className="login-popup-input">
              {currState === 'Sign In' ? null : <input name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder="Your name" required />}
              <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Your email" required />
              <input name="password" onChange={onChangeHandler} value={data.password} type="password" placeholder="Password" required />
            </div>
            <button type="submit">{currState === 'Sign Up' ? 'Create Account' : 'Sign In'}</button>
            <button type="button" onClick={googleSignIn} className="google-signin-button">
              Sign In with Google
            </button>
            <div className="login-popup-condition">
              <input type="checkbox" required />
              <p>By continuing, I agree to the terms of use & privacy policy.</p>
            </div>
            {currState === 'Sign In' ? (
              <p>Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click here</span></p>
            ) : (
              <p>Already have an account? <span onClick={() => setCurrState('Sign In')}>Sign In here</span></p>
            )}
          </form>
        </div>
      )}
      <div className={`admin-img ${token ? 'hidden' : ''}`}>
        <img src={admin_img} alt="Admin Header" />
      </div>
    </div>
  );
};

export default Home;
