import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import cross_icon from '../../assets/cross_icon.png';
import profile_icon from '../../assets/profile_icon.png';
import { StoreContext } from '../../context/StoreContext';
import axios from "axios";
import { auth, provider } from '../../firebase';
import { signInWithPopup} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken} = useContext(StoreContext);
  const [currState, setCurrState] = useState("Sign In");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    defaultphoto:"https://freesvg.org/img/abstract-user-flat-4.png"
  });

  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    if (currState === "Sign In") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }

    const response = await axios.post(newUrl, data);

    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      setShowLogin(false);
      navigate('/');
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
      const response = await axios.post(`${url}/api/user/google`, {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      });

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);
        navigate('/');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className='login-popup-container'>
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={cross_icon} alt="" />
        </div>
        <div className="login-popup-input">
          {currState === "Sign In" ? <></> : <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />}
          <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
          <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='password' required />
        </div>
        <button type='submit'>{currState === "Sign Up" ? "Create Account" : "Sign In"}</button>

        <button type='button' onClick={googleSignIn} className='google-signin-button'>
          Sign In with Google
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
        {currState === "Sign In" ? <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
          : <p>Already have an account? <span onClick={() => setCurrState("Sign In")}>Sign In here</span></p>}
      </form>
    </div>
  );
};

export default LoginPopup;
