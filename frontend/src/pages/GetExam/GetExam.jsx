// GetExam.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './GetExam.css';
import { jsPDF } from 'jspdf';
import { FaCheck, FaTimes } from 'react-icons/fa'; 

const GetExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [score, setScore] = useState(null);
  const [essayAnswers, setEssayAnswers] = useState([]);
  const [feedback, setFeedback] = useState([]); 
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes timer
  const [intervalId, setIntervalId] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [correctAnswers, setCorrectAnswers] = useState([]);
const [wrongAnswers, setWrongAnswers] = useState([]);
const [showReport, setShowReport] = useState(false);


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

  useEffect(() => {
    if (isStarted) {
      const id = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(id);
            handleSubmit();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      setIntervalId(id);

      return () => clearInterval(id);
    }
  }, [isStarted]);

  const handleOptionChange = (option) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = option;
    setSelectedOptions(newSelectedOptions);
    setAnsweredQuestions(prev => new Set(prev.add(currentQuestionIndex)));
  };

  const handleEssayChange = (e) => {
    const newEssayAnswers = [...essayAnswers];
    newEssayAnswers[currentQuestionIndex] = e.target.value;
    setEssayAnswers(newEssayAnswers);
    setAnsweredQuestions(prev => new Set(prev.add(currentQuestionIndex)));
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
  
    if (intervalId) clearInterval(intervalId);
    
    if (exam.option === 'mcq') {
      let correctAnswersList = [];
      let wrongAnswersList = [];
      exam.questions.forEach((question, index) => {
        if (selectedOptions[index] === question.answer) {
          correctAnswersList.push(question);
        } else {
          wrongAnswersList.push(question);
        }
      });
      setCorrectAnswers(correctAnswersList);
      setWrongAnswers(wrongAnswersList);
      const mcqScore = correctAnswersList.length;
      setScore(mcqScore);
  

      // Update user's exam score in the database
      try {
        await axios.post(`http://localhost:4000/api/user/score`, {
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

      // Add logic to get AI feedback for essay answers
      // Uncomment and adjust the code below to integrate with your AI service
      // try {
      //   const response = await axios.post('YOUR_AI_FEEDBACK_API_ENDPOINT', {
      //     answers: essayAnswers
      //   });
      //   setFeedback(response.data.feedback); // Assuming the AI service returns feedback in this format
      // } catch (error) {
      //   console.error('Error fetching AI feedback:', error);
      // }
    }
  };

  const downloadReport = () => {
  const doc = new jsPDF();
  
  let yOffset = 10;

  doc.setFontSize(16);
  doc.text('Correct Answers:', 10, yOffset);
  yOffset += 10;

  correctAnswers.forEach((q, i) => {
    doc.setFontSize(12);
    doc.text(`Question ${i + 1}: ${q.question}`, 10, yOffset);
    yOffset += 10;
    doc.text(`Your Answer: ${selectedOptions[i]}`, 10, yOffset);
    yOffset += 10;
    doc.text(`Correct Answer: ${q.answer}`, 10, yOffset);
    yOffset += 20;
  });

  doc.setFontSize(16);
  doc.text('Wrong Answers:', 10, yOffset);
  yOffset += 10;

  wrongAnswers.forEach((q, i) => {
    doc.setFontSize(12);
    doc.text(`Question ${i + 1}: ${q.question}`, 10, yOffset);
    yOffset += 10;
    doc.text(`Your Answer: ${selectedOptions[i]}`, 10, yOffset);
    yOffset += 10;
    doc.text(`Correct Answer: ${q.answer}`, 10, yOffset);
    yOffset += 20;
  });

  doc.save('exam_report.pdf');
};

  if (!exam) return <p>Loading...</p>;

  if (!isStarted) {
    return (
      <div className="get-exam-containers">
        <h1>{exam.name}</h1>
        <p>{exam.description}</p>
        <p>Rules for users:</p>
        <ul>
          <li>Complete the exam independently without external help.</li>
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
        {exam.option === 'mcq' && (
          <div>
            {!showReport && (
              <button onClick={() => setShowReport(true)}>View Report</button>
            )}
            {showReport && (
              <div className="report-container">
                <h2>Report</h2>
                <div className="answers-container">
                  {/* Correct and wrong answers combined and ordered */}
                  {[...correctAnswers.map((question, index) => ({
                    ...question,
                    type: 'correct',
                    index
                  })),
                  ...wrongAnswers.map((question, index) => ({
                    ...question,
                    type: 'wrong',
                    index
                  }))].sort((a, b) => a.index - b.index).map((question, index) => (
                    <div
                      key={index}
                      className={`answer-container ${question.type}`}
                    >
                      <p className="question-text">Question: {question.question}</p>
                      <p className="answer-text">
                        Your Answer: {selectedOptions[question.index]}
                        {question.type === 'correct' ? (
                          <FaCheck className="correct-icon" />
                        ) : (
                          <FaTimes className="wrong-icon" />
                        )}
                      </p>
                      {question.type === 'wrong' && (
                        <p className="correct-answer-text">Correct Answer: {question.answer}</p>
                      )}
                    </div>
                  ))}
                </div>
                <button onClick={downloadReport}>Download Report</button>
              </div>
            )}
            <button onClick={() => navigate('/exams')} className='return-btn'>Return to Exams</button>
          </div>
        )}
      </div>
    );

  }

  const currentQuestion = exam.option === 'mcq' ? exam.questions[currentQuestionIndex] : exam.essayQuestions[currentQuestionIndex];

  return (
    <div className="exam">
      <h1>{exam.name}</h1>
    <div className="get-exam">
      <div className="get-exam-container">
        
        <div className="exam-content">
          <form onSubmit={currentQuestionIndex === (exam.option === 'mcq' ? exam.questions.length : exam.essayQuestions.length) - 1 ? handleSubmit : (e) => { e.preventDefault(); handleNextQuestion(); }}>
            <div className="question-block">
              <p className="question-text"> Question {currentQuestionIndex + 1}: {exam.option === 'mcq' ? currentQuestion.question : currentQuestion}</p>
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
               <div className="essays">
                <div className="essay">
                  <h6>Your Answer goes here...</h6>
                <textarea
                  className="essay-input"
                  value={essayAnswers[currentQuestionIndex] || ''}
                  onChange={handleEssayChange}
                  rows="10"
                  cols="50"
                />
                </div>
                <div className="essay">
                <h6>Feedback</h6>
                <textarea
                  className="essay-input"
                  value={essayAnswers[currentQuestionIndex] || ''}
                  onChange={handleEssayChange}
                  rows="10"
                  cols="50"
                /> 
                </div>
                </div>
              )}
            </div>
            <div className="button-container">
              {currentQuestionIndex > 0 && (
                <button type="button" onClick={handlePreviousQuestion}>
                  Previous
                </button>
              )}
              <button type="submit">
              {currentQuestionIndex === (exam.option === 'mcq' ? exam.questions.length : exam.essayQuestions.length) - 1 ? (exam.option === 'essay' ? 'Check Answer' : 'Submit') : 'Next'}
              </button>
            </div>
          </form>
        </div>
      </div>
      {exam.option === 'mcq' ? (
        <div className="exam-sidebar-mcq-sidebar">
          <div className="timer">Time left: {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}</div>
          <div className="questions-queue">
            {exam.questions.map((question, index) => (
              <div
                key={index}
                className={`question-number ${currentQuestionIndex === index ? 'current' : ''} ${answeredQuestions.has(index) ? 'answered' : ''}`}
                onClick={() => handleQuestionSelect(index)}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <button onClick={handleSubmit} className="finish-btn">Finish Attempt Now</button>
        </div>
      ) : (
        <div className="exam-sidebar-essay-sidebar">
          <div className="timer">Time left: {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}</div>
          <div className="questions-queue">
            {exam.essayQuestions.map((question, index) => (
              <div
                key={index}
                className={`question-number ${currentQuestionIndex === index ? 'current' : ''} ${answeredQuestions.has(index) ? 'answered' : ''}`}
                onClick={() => handleQuestionSelect(index)}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <button onClick={handleSubmit} className="finish-btn">Finish Attempt Now</button>
        </div>
      )}
    </div>
    </div>
  );
};

export default GetExam;
