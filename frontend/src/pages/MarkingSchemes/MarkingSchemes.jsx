import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/thumbnail/lib/styles/index.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './MarkingSchemes.css';

const MarkingSchemes = () => {
    const [markingSchemes, setMarkingSchemes] = useState([]);
    const [subject, setSubject] = useState('');
    const [year, setYear] = useState('');
    const thumbnailPluginInstance = thumbnailPlugin();
    const token = localStorage.getItem('token'); // Get the JWT token from local storage

    useEffect(() => {
        const fetchMarkingSchemes = async () => {
            try {
                const res = await axios.get('http://localhost:4000/api/items');
                const markingSchemeItems = res.data.reverse().filter(item => item.option === 'markingScheme');
                setMarkingSchemes(markingSchemeItems);
            } catch (error) {
                console.error(error);
            }
        };
        fetchMarkingSchemes();
    }, []);

    const addFavoritePaper = async (paperId, paperName, file) => {
        try {
            if (!token) {
                toast.warning('Please login to add to favorites!');
                return;
            }
            await axios.post(
                'http://localhost:4000/api/favorites/add',
                { paperId, paperName, file },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Added to favorites!');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to add to favorites');
            }
        }
    };

    const handleFilter = () => {
        // Filter pdfs based on subject and year
        const filteredMarkingSchemes = markingSchemes.filter(markingScheme => 
            (subject ? markingScheme.subject === subject : true) &&
            (year ? markingScheme.year === year : true)
        );
        setMarkingSchemes(filteredMarkingSchemes);
    };

    return (
        <div className="marking-schemes">
            <ToastContainer />
            <h2>Marking Schemes</h2>
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
                <button onClick={handleFilter}>Filter</button>
            </div>
            <br />
            <div className="papers-list">
                {markingSchemes.map((markingScheme) => {
                    // Convert backslashes to forward slashes for the URL
                    const fileUrl = `http://localhost:4000/${markingScheme.markingSchemeFile.replace(/\\/g, '/')}`;
                    return (
                        <div key={markingScheme._id} className="paper-item">
                            <div className="paper-thumbnail">
                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.10.111/build/pdf.worker.min.js">
                                    <Viewer fileUrl={fileUrl} plugins={[thumbnailPluginInstance]} />
                                </Worker>
                            </div>
                            <div className="paper-info">
                                <h3>{markingScheme.name} <br /> ({markingScheme.year})</h3>
                                <p>{markingScheme.description}</p>
                                <a href={fileUrl} download>
                                    <button>Download Now</button>
                                </a>
                                <button onClick={() => addFavoritePaper(markingScheme._id, markingScheme.name, markingScheme.markingSchemeFile)} className='fav-btn'>Add to Favorites</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MarkingSchemes;
