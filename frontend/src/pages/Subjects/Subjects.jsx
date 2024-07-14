import React from 'react';
import './Subjects.css';
import { Link } from 'react-router-dom';
import mathImage from '../../assets/math.jpg';
import scienceImage from '../../assets/science.webp';
import historyImage from '../../assets/history.jpg';
import geographyImage from '../../assets/geography.avif';
import englishImage from '../../assets/english.png';
import commerceImage from '../../assets/commerce.jpg';
import civicImage from '../../assets/civic.jpg';
import englishlitImage from '../../assets/englishlit.jpg';
import ictImage from '../../assets/ict.jpg';
import healthImage from '../../assets/health.jpg';
import homescienceImage from '../../assets/homescience.jpg';





const Subjects = () => {
    const subjects = [
        {
            id: 'Math',
            name: 'Math',
            description: 'Explore the world of mathematics.',
            image: mathImage,
        },
        {
            id: 'Science',
            name: 'Science',
            description: 'Discover the wonders of science.',
            image: scienceImage,
        },
        {
            id: 'History',
            name: 'History',
            description: 'Learn about past events and civilizations.',
            image: historyImage,
        },
        {
            id: 'Geography',
            name: 'Geography',
            description: 'Explore the Earth\'s landscapes and environments.',
            image: geographyImage,
        },
        {
            id: 'English',
            name: 'English',
            description: 'Improve your language skills and literary knowledge.',
            image: englishImage,
        },
        {
            id: 'Commerce',
            name: 'Commerce',
            description: 'Understand the fundamentals of business and economics.',
            image: commerceImage,
        },
        {
            id: 'Citizenship',
            name: 'Citizenship Education',
            description: 'Learn about civic responsibilities and rights.',
            image: civicImage,
        },
        {
            id: 'EnglishLit',
            name: 'English Literature',
            description: 'Delve into classic and modern literary works.',
            image: englishlitImage,
        },
        {
            id: 'ICT',
            name: 'ICT',
            description: 'Explore the world of information and communication technology.',
            image: ictImage,
        },
        {
            id: 'Health',
            name: 'Health and Physical Education',
            description: 'Learn about maintaining a healthy lifestyle and physical fitness.',
            image: healthImage,
        },
        {
            id: 'HomeEconomics',
            name: 'Home Economics',
            description: 'Develop skills in managing a household and family well-being.',
            image: homescienceImage,
        },
    ];

    return (
        <div className="subject-container" style={{ maxWidth: '80%', margin: 'auto' }}>
            <h2>Subjects</h2>
            <div className="subject-cards">
                {subjects.map(subject => (
                    <Link to={`/subjects/${subject.id}`} key={subject.id} className="subject-card-link">
                        <div className="subject-card">
                            <img src={subject.image} alt={subject.name} />
                            <h3>{subject.name}</h3>
                            <p>{subject.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Subjects;

