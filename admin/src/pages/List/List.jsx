import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import './List.css';

const List = () => {
  const [items, setItems] = useState([]);
  const [expandedItemId, setExpandedItemId] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/items');
        setItems(res.data.reverse());
      } catch (error) {
        console.error(error);
      }
    };

    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/items/${id}`);
      setItems(prevItems => prevItems.filter(item => item._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleDetails = (id) => {
    setExpandedItemId(id === expandedItemId ? null : id);
  };

  return (
    <div className="list">
       <AdminSidebar />
    
    <div className="list-page">
      
      <h2>Added Items</h2>
      <ul>
        {items.map((item, index) => (
          <li key={item._id} className={expandedItemId === item._id ? 'expanded' : ''}>
            <div className="item-preview">
              <div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p>Created: {new Date(item.createdAt).toLocaleString()}</p>
              </div>
              </div>
              <button onClick={() => handleDelete(item._id)}>Delete</button> <br />
                <span className="toggle-details-link" onClick={() => toggleDetails(item._id)}>
                  {expandedItemId === item._id ? 'Hide Details' : 'Show Details'}
                </span> 
        
           
            {expandedItemId === item._id && (
              <div className="item-details">
                {item.option === 'pdf' && (
                  <a href={`http://localhost:4000/${item.file}`} target="_blank" rel="noopener noreferrer">
                  Download PDF
                </a>
                )}
                {item.option === 'markingScheme' && (
                  <a href={`http://localhost:4000/${item.markingSchemeFile}`} target="_blank" rel="noopener noreferrer">
                  Download PDF
                </a>
                )}
                {item.option === 'mcq' && (
                  <div>
                    <p>Type: MCQ</p><br />
                  {item.questions.map((q, i) => (
                      <div key={i}>
                         <b><p>Question: {q.question}</p></b>
                        {q.options.map((opt, j) => (
                          <p key={j}>Option {j + 1}: {opt}</p>
                        ))}
                        <p>Answer: {q.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
                {item.option === 'essay' && (
                  <div>
                    <p>Type: Structured Essay</p><br />
                    {item.essayQuestions.map((q, i) => (
                     <b><p key={i}>Question: {q}</p></b> 
                    ))}
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default List;
