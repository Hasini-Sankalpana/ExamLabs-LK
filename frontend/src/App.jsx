import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Footer from './components/Footer/Footer'
import Dashboard from './pages/Dashboard/Dashboard'
import Exams from './pages/Exams/Exams'
import Favorites from './pages/Favorites/Favorites'
import Settings from './pages/Settings/Settings'
import AllPapers from './pages/AllPapers/AllPapers'
import GetExam from './pages/GetExam/GetExam'
import MarkingSchemes from './pages/MarkingSchemes/MarkingSchemes'
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy'
import Subject from './pages/Subject/Subject'
import Subjects from './pages/Subjects/Subjects'
import About from './components/AboutUs/AboutUs'
import AboutUs from './components/AboutUs/AboutUs'



const App = () => {

  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
    {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
    <div className='app'>
     <Navbar setShowLogin={setShowLogin}/> 
        <Routes>
          <Route path='/' element={<Home setShowLogin={setShowLogin}/>} />
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/exams' element={<Exams/>} />
          <Route path="/exams/:id" element={<GetExam />} />
          <Route path='/favorites' element={<Favorites />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/all-papers' element={<AllPapers />} />
          <Route path='/marking-schemes' element={<MarkingSchemes />} />
          <Route path='/privacy-policy' element={<PrivacyPolicy />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/subjects/:subject" element={<Subject />} />
          

        </Routes>
    </div>
   
    <Footer/>
    
    </>
    
  )
}

export default App