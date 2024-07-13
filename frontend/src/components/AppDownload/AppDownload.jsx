import React from 'react';
import './AppDownload.css';
import play_store from '../../assets/play_store.png';
import app_store from '../../assets/app_store.png';

const AppDownload = () => {
  return (
    <div className='app-download' id='app-download'>
        <p>For Better Experiance Download <br /> <span>ExamLabs LK App</span></p>
        <div className="app-download-platforms">
            <img src={play_store} alt="" />
            <img src={app_store} alt="" />
        </div>

    </div>
  )
}

export default AppDownload