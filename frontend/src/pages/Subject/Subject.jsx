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
import load from '../../assets/load.gif';

const Subject = () => {
    const { subject } = useParams();
    const [pdfs, setPdfs] = useState([]);
    const [markingSchemes, setMarkingSchemes] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [loading, setLoading] = useState(true); // Loading state
    const thumbnailPluginInstance = thumbnailPlugin();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true); // Start loading
            try {
                const response = await axios.get(`http://localhost:4000/api/items?subject=${subject}`);
                let pdfItems = response.data.reverse().filter(item => item.option === 'pdf');
                let markingSchemeItems = response.data.reverse().filter(item => item.option === 'markingScheme');

                // Apply year filter if selectedYear is set
                if (selectedYear) {
                    pdfItems = pdfItems.filter(pdf => pdf.year === selectedYear);
                    markingSchemeItems = markingSchemeItems.filter(markingScheme => markingScheme.year === selectedYear);
                }

                setPdfs(pdfItems);
                setMarkingSchemes(markingSchemeItems);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
            setLoading(false); // Stop loading
        };
        fetchItems();
    }, [subject, selectedYear]);

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
            {loading ? ( // Show loading GIF if loading
                <div className="loading-container">
                    <img src={load} alt="Loading..." className="loading-gif" />
                </div>
            ) : (
                <>
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
                    {pdfs.length > 0 ? (
                        <div className="papers-list-subject">
                            <h2>PAST PAPERS</h2>
                            <div className="paper-content">
                                {pdfs.map(pdf => (
                                    <div key={pdf._id} className="paper-item">
                                        <div className="paper-thumbnail">
                                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.10.111/build/pdf.worker.min.js">
                                                <Viewer fileUrl={pdf.file ? `http://localhost:4000/${pdf.file.replace(/\\/g, '/')}` : null} plugins={[thumbnailPluginInstance]} />
                                            </Worker>
                                        </div>
                                        <div className="paper-info">
                                            <h3>{pdf.name}</h3>
                                            <p>({pdf.year})</p>
                                           {/* <p>{pdf.description}</p>*/}
                                            {pdf.file && (
                                                <a href={`http://localhost:4000/${pdf.file.replace(/\\/g, '/')}`} download>
                                                    <button>View Now</button>
                                                </a>
                                            )}
                                            <button onClick={() => addFavoritePaper(pdf._id, pdf.name, pdf.file)} className='fav-btn'>Add to Favorites</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="no-past-papers">
                            <h3>No Past Papers Available</h3>
                        </div>
                    )}
                    {markingSchemes.length > 0 ? (
                        <div className="papers-list-subject">
                            <h2>MARKING SCHEMES</h2>
                            <div className="paper-content-marking">
                                {markingSchemes.map(markingScheme => (
                                    <div key={markingScheme._id} className="paper-item">
                                        <div className="paper-thumbnail">
                                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.10.111/build/pdf.worker.min.js">
                                                <Viewer fileUrl={markingScheme.markingSchemeFile ? `http://localhost:4000/${markingScheme.markingSchemeFile.replace(/\\/g, '/')}` : null} plugins={[thumbnailPluginInstance]} />
                                            </Worker>
                                        </div>
                                        <div className="paper-info">
                                            <h3>{markingScheme.name}</h3> 
                                            <p>({markingScheme.year})</p>
                                            {/*<p>{markingScheme.description}</p>*/}
                                            {markingScheme.markingSchemeFile && (
                                                <a href={`http://localhost:4000/${markingScheme.markingSchemeFile.replace(/\\/g, '/')}`} download>
                                                    <button>View Now</button>
                                                </a>
                                            )}
                                            <button onClick={() => addFavoritePaper(markingScheme._id, markingScheme.name, markingScheme.markingSchemeFile)} className='fav-btn'>Add to Favorites</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="no-marking-schemes">
                            <h3>No Marking Schemes Available</h3>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Subject;
