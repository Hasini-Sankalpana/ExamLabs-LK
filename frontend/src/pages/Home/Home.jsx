import React, { useContext } from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import AppDownload from '../../components/AppDownload/AppDownload';
import Subjects from '../../components/Subjects/Subjects';
import { StoreContext } from '../../context/StoreContext';
import RecentPapers from '../../components/RecentPapers/RecentPapers';
import AboutUs from '../../components/AboutUs/AboutUs';


const Home = ({ setShowLogin }) => {

  const { token } = useContext(StoreContext); 
  return (
    <div className='home'>
        <Header token={token} setShowLogin={setShowLogin} />
        <Subjects/>
        <RecentPapers/>
        <AboutUs token={token} setShowLogin={setShowLogin}/>
        <AppDownload/>

    </div>
  )
}

export default Home