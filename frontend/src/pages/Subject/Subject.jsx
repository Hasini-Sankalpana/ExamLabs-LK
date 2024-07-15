
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/thumbnail/lib/styles/index.css';
import './Subject.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Subject = () => {
    const { subject } = useParams();
    const [pdfs, setPdfs] = useState([]);
    const [selectedYear, setSelectedYear] = useState(''); // State for selected year filter
    const thumbnailPluginInstance = thumbnailPlugin();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/items?subject=${subject}`);
                let pdfItems = response.data.reverse().filter(item => item.option === 'pdf');
                
                // Apply year filter if selectedYear is set
                if (selectedYear) {
                    pdfItems = pdfItems.filter(pdf => pdf.year === selectedYear);
                }

                setPdfs(pdfItems);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };
        fetchItems();
    }, [subject, selectedYear]); // Include selectedYear in dependencies array

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

    return (
        <div className="subject-page-container">
            <ToastContainer />
            <h1>{subject}</h1>
            <div className="filter-by-year">
                <label>Filter by Year:</label>
                <select
    value={selectedYear}
    onChange={(e) => setSelectedYear(e.target.value)}
>
    <option value="">All</option>
    {[...Array(25)].map((_, index) => {
        const year = 2000 + index;
        return (
            <option key={year} value={year.toString()}>
                {year}
            </option>
        );
    })}
</select>
            </div>
            <div className="papers-list">
                {pdfs.map(pdf => (
                    <div key={pdf._id} className="paper-item">
                        <div className="paper-thumbnail">
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.10.111/build/pdf.worker.min.js">
                                <Viewer fileUrl={pdf.file ? `http://localhost:4000/${pdf.file.replace(/\\/g, '/')}` : null} plugins={[thumbnailPluginInstance]} />
                            </Worker>
                        </div>
                        <div className="paper-info">
                            <h3>{pdf.name} <br /> ({pdf.year})</h3>
                            <p>{pdf.description}</p>
                            {pdf.file && (
                                <a href={`http://localhost:4000/${pdf.file.replace(/\\/g, '/')}`} download>
                                    <button>Download Now</button>
                                </a>
                            )}
                            <button onClick={() => addFavoritePaper(pdf._id, pdf.name, pdf.file)} className='fav-btn'>Add to Favorites</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Subject;
