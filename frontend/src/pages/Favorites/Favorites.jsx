import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Favorites.css';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:4000/api/favorites", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setFavorites(response.data.favorites.reverse());
            } catch (error) {
                console.error("Error fetching favorites:", error);
            }
        };

        fetchFavorites();
    }, []);

    const removeFavorite = async (paperId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.delete(`http://localhost:4000/api/favorites/${paperId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.data.success) {
                setFavorites(favorites.filter(paper => paper.paperId !== paperId));
            } else {
                console.error(res.data.message);
            }
        } catch (error) {
            console.error("An error occurred while removing the favorite", error);
        }
    };

    const handleDownload = (file) => {
      // Implement download logic here
      window.open(`http://localhost:4000/${file}`, '_blank');
  };


    return (
        <div className="favorites-container">
        <Sidebar />
        <div className="favorites-content">
            <div className="favorites-header">
                <h1>Favorites</h1>
            </div>
            {favorites.length > 0 ? (
                <ul className="favorites-list">
                    {favorites.map((paper) => (
                        <li key={paper.paperId} className="favorite-item">
                            <div>
                                <h2>{paper.paperName}</h2>
                            </div>
                            <div>
                                <button onClick={() => handleDownload(paper.file)}>Download</button>
                                <button onClick={() => removeFavorite(paper.paperId)}>Remove</button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="no-favorites-message">
                    <p>No favorite papers yet. Add some to see them here!</p>
                </div>
            )}
        </div>
    </div>
);
};

export default Favorites;
