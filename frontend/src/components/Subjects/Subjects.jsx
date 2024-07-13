// src/components/Subjects/Subjects.jsx
import React from 'react';
import './Subjects.css';

const subjects = [
  'Science', 'Mathematics', 'English', 'Commerce', 'English Literature', 'Geography', 
  'History', 'Citizenship Studies', 'Art', 'ICT', 
   'Buddhism', 'Agriculture', 'Western Music', 'Japanese'
];

const Subjects = () => {
  return (
    <div className="subjects" id='subjects'>
      <h2>Trending Subjects</h2>
      <div className="subject-list">
        {subjects.map((subject, index) => (
          <div key={index} className="subject-item">{subject}</div>
        ))}
      </div>
    </div>
  );
};

export default Subjects;
