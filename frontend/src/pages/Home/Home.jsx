import React, { useContext } from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import AppDownload from '../../components/AppDownload/AppDownload';
import Subjects from '../../components/Subjects/Subjects';
import { StoreContext } from '../../context/StoreContext';
import RecentPapers from '../../components/RecentPapers/RecentPapers';



const Home = ({ setShowLogin }) => {

  const { token } = useContext(StoreContext); 
  return (
    <div className='home'>
        <Header token={token} setShowLogin={setShowLogin} />
        <Subjects/>
        <RecentPapers/>
        <AppDownload/>

    </div>
  )
}

export default Home