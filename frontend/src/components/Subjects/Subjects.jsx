import React from 'react';
import { Link } from 'react-router-dom';
import './Subjects.css';

const subjects = [
  'Science', 'Mathematics', 'English', 'Commerce', 'English Literature', 'Geography',
  'History', 'Citizenship', 'Art', 'ICT',
 , 'Music','Health and Physical Education','Tamil','Home Economics'
];

const Subjects = () => {
  return (
    <div className="subjects" id='subjects'>
      <h2>Trending Subjects</h2>
      <div className="subject-list">
        {subjects.map((subject, index) => (
          <Link to={`/subjects/${subject}`} key={index} className="subject-item-link">
            <div className="subject-item">{subject}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Subjects;
