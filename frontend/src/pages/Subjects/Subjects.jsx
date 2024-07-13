import React from 'react';
import './Subject.css';
import { Link } from 'react-router-dom'; // Assuming you are using React Router for navigation

// Placeholder images for demonstration
import mathImage from '../../assets/math.jpg';
import scienceImage from '../../assets/science.webp';
import historyImage from '../../assets/history.jpg';
import geographyImage from '../../assets/geography.avif';
import englishImage from '../../assets/english.png';

const Subject = () => {
    const subjects = [
        {
            id: 1,
            name: 'Math',
            description: 'Explore the world of mathematics.',
            image: mathImage,
        },
        {
            id: 2,
            name: 'Science',
            description: 'Discover the wonders of science.',
            image: scienceImage,
        },
        {
            id: 3,
            name: 'History',
            description: 'Learn about past events and civilizations.',
            image: historyImage,
        },
        {
            id: 4,
            name: 'Geography',
            description: 'Explore the Earth\'s landscapes and environments.',
            image: geographyImage,
        },
        {
            id: 5,
            name: 'English',
            description: 'Improve your language skills and literary knowledge.',
            image: englishImage,
        },
    ];

    return (
        <div className="subject-container" style={{ maxWidth: '80%', margin: 'auto' }}>
            <h2>Subjects</h2>
            <div className="subject-cards">
                {subjects.map(subject => (
                    <div key={subject.id} className="subject-card">
                        <img src={subject.image} alt={subject.name} />
                        <h3>{subject.name}</h3>
                        <p>{subject.description}</p>
                        <Link to={`/papers/${subject.name}`} className="view-papers-button">
                            View Papers
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Subject;
