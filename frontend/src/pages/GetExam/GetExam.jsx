// GetExam.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './GetExam.css';

const GetExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [score, setScore] = useState(null);
  const [essayAnswers, setEssayAnswers] = useState([]);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/items/${id}`);
        setExam(response.data);
      } catch (error) {
        console.error('Error fetching exam:', error);
      }
    };

    fetchExam();
  }, [id]);

  const handleOptionChange = (option) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = option;
    setSelectedOptions(newSelectedOptions);
  };

  const handleEssayChange = (e) => {
    const newEssayAnswers = [...essayAnswers];
    newEssayAnswers[currentQuestionIndex] = e.target.value;
    setEssayAnswers(newEssayAnswers);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (exam.option === 'mcq') {
      let correctAnswers = 0;
      exam.questions.forEach((question, index) => {
        if (selectedOptions[index] === question.answer) {
          correctAnswers += 1;
        }
      });
      const mcqScore = correctAnswers;
      setScore(mcqScore);

      // Update user's exam score in the database
      try {
        const response = await axios.post(`http://localhost:4000/api/user/score`, {
          examName: exam.name,
          score: mcqScore
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Include your JWT token here
          }
        });

       
      } catch (error) {
        console.error('Error updating score:', error);
      }
    } else if (exam.option === 'essay') {
      setScore('Essay submitted. Grading will be done manually.');
    }
  };

  if (!exam) return <p>Loading...</p>;

  if (!isStarted) {
    return (
      <div className="get-exam-containers">
        <h1>{exam.name}</h1>
        <p>{exam.description}</p>
        <p>Rules for users:</p>
        <ul>
          <li> Complete the exam independently without external help.</li>
          <li>Ensure a reliable internet connection before starting.</li>
          <li>Rule 3</li>
        </ul>
        <button onClick={() => setIsStarted(true)}>Start Quiz</button>
      </div>
    );
  }

  if (score !== null) {
    return (
      <div className="get-exam-containers">
        <h1>Your Score: {score}/{exam.option === 'mcq' ? exam.questions.length : 'N/A'}</h1>
        <button onClick={() => navigate('/exams')} className='return-btn'>Return to Exams</button>
      </div>
    );
  }

  const currentQuestion = exam.option === 'mcq' ? exam.questions[currentQuestionIndex] : exam.essayQuestions[currentQuestionIndex];

  return (
    <div className="get-exam-container">
      <h1>{exam.name}</h1>
      <form onSubmit={currentQuestionIndex === (exam.option === 'mcq' ? exam.questions.length : exam.essayQuestions.length) - 1 ? handleSubmit : (e) => { e.preventDefault(); handleNextQuestion(); }}>
        <div className="question-block">
          <p className="question-text">{currentQuestionIndex + 1}. {exam.option === 'mcq' ? currentQuestion.question : currentQuestion}</p>
          {exam.option === 'mcq' ? (
            <div className="options-container">
              {currentQuestion.options.map((option, oIndex) => (
                <div
                  key={oIndex}
                  className={`option ${selectedOptions[currentQuestionIndex] === option ? 'selected' : ''}`}
                  onClick={() => handleOptionChange(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          ) : (
            <textarea
              className="essay-input"
              value={essayAnswers[currentQuestionIndex] || ''}
              onChange={handleEssayChange}
              rows="10"
              cols="50"
            />
          )}
        </div>
        <div className="button-container">
          {currentQuestionIndex > 0 && (
            <button type="button" onClick={handlePreviousQuestion}>
              Previous
            </button>
          )}
          <button type="submit">
            {currentQuestionIndex === (exam.option === 'mcq' ? exam.questions.length : exam.essayQuestions.length) - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GetExam;
