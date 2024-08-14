import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import examsimg from '../../assets/exam.png'
import './Exams.css';

const Exams = () => {
  const [mcqQuestions, setMCQQuestions] = useState([]);
  const [essayQuestions, setEssayQuestions] = useState([]);
  const [filteredMCQs, setFilteredMCQs] = useState([]);
  const [filteredEssays, setFilteredEssays] = useState([]);
  const [subject, setSubject] = useState('');
  const [year, setYear] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/items');
        const mcqItems = response.data.reverse().filter(item => item.option === 'mcq');
        const essayItems = response.data.reverse().filter(item => item.option === 'essay');
        setMCQQuestions(mcqItems);
        setEssayQuestions(essayItems);
        setFilteredMCQs(mcqItems);
        setFilteredEssays(essayItems);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const handleFilter = () => {
    setFilteredMCQs(
      mcqQuestions.filter(q => 
        (subject ? q.subject === subject : true) && 
        (year ? q.year === year : true)
      )
    );
    setFilteredEssays(
      essayQuestions.filter(q => 
        (subject ? q.subject === subject : true) && 
        (year ? q.year === year : true)
      )
    );
  };

  const handleAttemptQuiz = (id) => {
    navigate(`/exams/${id}`);
  };

  return (  
    <div className="exams-container">
       <link
    href="https://cdn.jsdelivr.net/npm/remixicon@4.0.0/fonts/remixicon.css"
    rel="stylesheet"/>
        <Sidebar />
      <div className="exams-content">
        <div className="exams-header">
          <h1>Get Exams</h1>
          <div className="filter-container">
            <select onChange={(e) => setSubject(e.target.value)} value={subject}>
              <option value="">All Subjects</option>
              <option value="Math">Math</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Geography">Geography</option>
              <option value="English">English</option>
            </select>
            <select onChange={(e) => setYear(e.target.value)} value={year}>
              <option value="">All Years</option>
              {Array.from({ length: 25 }, (_, i) => 2000 + i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <button onClick={handleFilter}>Filter <i class="ri-filter-2-line"></i></button>
          </div>
        </div>
        {filteredMCQs.length > 0 ? (
        <div className="questions-section">
          <h2>MCQ</h2>
          <div className="mcq-container">
            {filteredMCQs.map((mcq, index) => (
              <div key={index} className="mcq-block">
                <h3>{mcq.name} ({mcq.year})</h3>
                <p>{mcq.description}</p>
                <button onClick={() => handleAttemptQuiz(mcq._id)}>
                  Attempt Quiz
                </button>
              </div>
            ))}
          </div>
        </div>
        ):(
          <div className="no-mcqs">
                    <h3>No MCQs Available</h3>
                </div>
        )}
        {filteredEssays.length > 0 ? (
        <div className="questions-section2">
          <h2>Structured Essay </h2>
          <div className="essay-container">
            {filteredEssays.map((essay, index) => (
              <div key={index} className="essay-block">
                <h3>{essay.name} ({essay.year})</h3>
                <p>{essay.description}</p>
                <button onClick={() => handleAttemptQuiz(essay._id)}>
                  Attempt Quiz
                </button>
              </div>
            ))}
          </div>
        </div>
        ):(
          <div className="no-essays">
                    <h3>No Structured Esaays Available</h3>
                </div>
        )}
      </div>
          
   
    </div>
  
  );
};

export default Exams;
