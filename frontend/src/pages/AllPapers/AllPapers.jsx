// AllPapers.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/thumbnail/lib/styles/index.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AllPapers.css';

const AllPapers = () => {
    const [pdfs, setPdfs] = useState([]);
    const [filteredPdfs, setFilteredPdfs] = useState([]);
    const [subject, setSubject] = useState('');
    const [year, setYear] = useState('');
    const thumbnailPluginInstance = thumbnailPlugin();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchPdfs = async () => {
            try {
                const res = await axios.get('http://localhost:4000/api/items');
                const pdfItems = res.data.reverse().filter(item => item.option === 'pdf');
                setPdfs(pdfItems);
                setFilteredPdfs(pdfItems); // Initialize filteredPdfs with all fetched PDFs
            } catch (error) {
                console.error(error);
            }
        };
        fetchPdfs();
    }, []);

    const addFavoritePaper = async (paperId, paperName, file) => {
        try {
            if (!token) {
                toast.warning('Please login to add to favorites!');
                return;
            }
            const res = await axios.post(
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
        let filteredPdfs = pdfs;

        // Apply subject filter if subject is selected
        if (subject) {
            filteredPdfs = filteredPdfs.filter(pdf => pdf.subject === subject);
        }

        // Apply year filter if year is selected
        if (year) {
            filteredPdfs = filteredPdfs.filter(pdf => pdf.year === year);
        }

        // Update filteredPdfs state with the filtered results
        setFilteredPdfs(filteredPdfs);
    };

    return (
        <div className="all-papers">
            <ToastContainer />
            <h2>All Papers</h2>
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
                {filteredPdfs.map((pdf) => (
                    <div key={pdf._id} className="paper-item">
                        <div className="paper-thumbnail">
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.10.111/build/pdf.worker.min.js">
                                <Viewer fileUrl={`http://localhost:4000/${pdf.file.replace(/\\/g, '/')}`} plugins={[thumbnailPluginInstance]} />
                            </Worker>
                        </div>
                        <div className="paper-info">
                            <h3>{pdf.name} <br /> ({pdf.year})</h3>
                            <p>{pdf.description}</p>
                            <a href={`http://localhost:4000/${pdf.file.replace(/\\/g, '/')}`} download>
                                <button>Download Now</button>
                            </a>
                            <button onClick={() => addFavoritePaper(pdf._id, pdf.name, pdf.file)} className='fav-btn'>Add to Favorites</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllPapers;
