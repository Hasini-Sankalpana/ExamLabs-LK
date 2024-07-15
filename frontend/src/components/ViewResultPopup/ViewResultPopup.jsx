import React from 'react';
import './ViewResultPopup.css';
import scoreimg from '../../assets/score.png';

const ViewResultPopup = ({ show, onClose, score }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="popup-overlay">
      <div className="popup">
        <img src={scoreimg} alt="Score" className="score-image" />
        <div className="popup-content">
          <button className="close-button" onClick={onClose}>×</button>
          <h2>You Scored</h2>
          <p>Score: {score}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewResultPopup;
