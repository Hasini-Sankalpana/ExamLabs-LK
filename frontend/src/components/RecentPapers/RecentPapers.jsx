import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/thumbnail/lib/styles/index.css';
import './RecentPapers.css';

const RecentPapers = () => {
  const [recentPdfs, setRecentPdfs] = useState([]);
  const thumbnailPluginInstance = thumbnailPlugin();


  useEffect(() => {
    const fetchRecentPdfs = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/items/recent-pdfs');
        setRecentPdfs(res.data);
      } catch (error) {
        console.error('Error fetching recent PDFs:', error);
        console.error(error);
      }
    };
    fetchRecentPdfs();
  }, []);

  return (
    <div className="recent-papers">
      <h2>Recent Updates</h2>
      <div className="papers-list">
        {recentPdfs.map((pdf) => (
          <div key={pdf._id} className="paper-item">
            <div className="paper-thumbnail">
                            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.10.111/build/pdf.worker.min.js`}>
                                <Viewer fileUrl={`http://localhost:4000/${pdf.file}`} plugins={[thumbnailPluginInstance]} />
                            </Worker>
                        </div>
            <div className="paper-info">
              <h3>{pdf.name}</h3>
              <p>({pdf.year})</p>
              {/*<p>{pdf.description}</p>*/}
              <br />
              <a href={`http://localhost:4000/${pdf.file}`} download>
                <button>Download Now</button>
              </a>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default RecentPapers;
