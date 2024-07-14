import React from 'react';
import './About.css';
import { useNavigate } from 'react-router-dom';
import comm_01 from '../../assets/comm_01.png';
import comm_02 from '../../assets/comm_02.png';
import comm_03 from '../../assets/comm_03.png';

const About = ({ token, setShowLogin }) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (token) {
      // If user is logged in, navigate to the dashboard
      navigate('/dashboard');
    } else {
      // If user is not logged in, show the login popup
      setShowLogin(true);

      // Scroll to the header section
      const header = document.getElementById('navbar');
      header.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDownloadNow = () => {
    // Navigate to the All Papers page
    navigate('/subjects');
  };

  return (
    <div className="about-content" id="about-content">
      <div className="about">
        <img src={comm_01} alt="Community 01" />
        <h3>Download Past Papers</h3>
        <h6>
          Access a comprehensive library of O-Level past papers from previous
          years. Download PDFs for all subjects, including Science, Maths,
          Geography, Information Technology, English, History and more. These resources are
          essential for understanding the exam format and practicing under real
          exam conditions. Start building your own collection of past papers
          and prepare thoroughly for your exams by practicing regularly. With
          our extensive database, you'll never run out of materials to review.
        </h6>
        <button onClick={handleDownloadNow}>Download Now</button>
      </div>

      <div className="about">
        <img src={comm_02} alt="Community 02" />
        <h3>Take MCQ and Essay Exams</h3>
        <h6>
          Enroll in interactive multiple-choice and structured essay question
          exams designed to test your knowledge and prepare you for the real
          O-Level exams. Our platform provides instant feedback on your
          performance, allowing you to understand your strengths and areas for
          improvement. The structured essay exams are helping you to practice
          time management and develop your writing skills. The more you
          practice, the more confident you'll become in tackling different
          types of questions.
        </h6>
        <button onClick={handleGetStarted}>Get Started</button>
      </div>

      <div className="about">
        <img src={comm_03} alt="Community 03" />
        <h3>Track Your Progress</h3>
        <h6>
          Keep an eye on your performance with our detailed and intuitive
          dashboard. View your scores from multiple-choice and essay exams,
          track your progress over time, and identify areas that need more
          focus. Our progress tracker helps you stay motivated by showing you
          how far you've come and highlighting improvements in your scores. Use
          these insights to tailor your study plan and maximize your
          preparation efforts. Watch your scores improve as you consistently
          practice and prepare for your O-Level exams.
        </h6>
        <button onClick={handleGetStarted}>Get Started</button>
      </div>
    </div>
  );
};

export default About;
