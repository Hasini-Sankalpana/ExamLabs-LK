import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';

import { Route, Routes } from 'react-router-dom';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import UserOverview from './pages/UserOverview/UserOverview';
import Home from './pages/Home/Home';

const App = () => {
  const [items, setItems] = useState([]);

  const handleAddItem = (item) => {
    setItems([...items, item]);
  };

  return (
    <div>
      <Navbar />
      <hr />
      <div className="app-content">
        
        <Routes>
          <Route path='/add/:id?' element={<Add onAddItem={handleAddItem} />} />
          <Route path='/list' element={<List items={items} />} />
          <Route path='/UserOverview' element={<UserOverview/>} />
          <Route path='/' element={<Home onAddItem={handleAddItem} items={items}/>} />



        </Routes>
      </div>
    </div>
    
  );
};

export default App;
