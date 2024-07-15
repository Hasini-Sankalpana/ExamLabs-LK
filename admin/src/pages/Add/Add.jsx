import React, { useState } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import upload_img from '../../assets/upload_img.png';
import './Add.css';

const Add = ({ onAddItem }) => {
  const [file, setFile] = useState(null);
  const [filePath, setFilePath] = useState('');
  const [markingSchemeFile, setMarkingSchemeFile] = useState(null);
  const [markingSchemeFilePath, setMarkingSchemeFilePath] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [option, setOption] = useState('pdf');
  const [subject, setSubject] = useState('Math');
  const [year, setYear] = useState('2023');
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], answer: '' }]);
  const [essayQuestions, setEssayQuestions] = useState(['']);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFilePath(e.target.files[0]?.name || '');
  };

  const handleMarkingSchemeFileChange = (e) => {
    setMarkingSchemeFile(e.target.files[0]);
    setMarkingSchemeFilePath(e.target.files[0]?.name || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('option', option);
    formData.append('subject', subject);
    formData.append('year', year);
    if (file) formData.append('file', file);
    if (markingSchemeFile) formData.append('markingSchemeFile', markingSchemeFile);
    formData.append('questions', JSON.stringify(questions));
    formData.append('essayQuestions', JSON.stringify(essayQuestions));


    try {
      const res = await axios.post('http://localhost:4000/api/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Created item:', res.data);
      onAddItem(res.data);
    } catch (error) {
      console.error(error);
    }

    setName('');
    setDescription('');
    setOption('pdf');
    setSubject('Math');
    setYear('2023');
    setFile(null);
    setFilePath('');
    setMarkingSchemeFile(null);
    setMarkingSchemeFilePath('');
    setQuestions([{ question: '', options: ['', '', '', ''], answer: '' }]);
    setEssayQuestions(['']);
  };

  const handleOptionChange = (e) => {
    setOption(e.target.value);
  };

  const handleQuestionChange = (index, e) => {
    const newQuestions = [...questions];
    newQuestions[index][e.target.name] = e.target.value;
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], answer: '' }]);
  };

  const handleEssayChange = (index, e) => {
    const newEssays = [...essayQuestions];
    newEssays[index] = e.target.value;
    setEssayQuestions(newEssays);
  };

  const handleAddEssay = () => {
    setEssayQuestions([...essayQuestions, '']);
  };

  const handleImageClick = () => {
    if (option === 'pdf') {
      document.getElementById('fileInput')?.click();
    } else if (option === 'markingScheme') {
      document.getElementById('markingSchemeFileInput')?.click();
    }
  };

  return (
    <div className="add">
      <AdminSidebar />

      <div className="add-page">
        <h2>Add New Content</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div className="form-group-inline">
            <div className="form-group">
              <label>Subject</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} required>
                <option value="Math">Math</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="Sinhala">Sinhala</option>
                <option value="History">History</option>
                <option value="Geography">Geography</option>
                <option value="Commerce">Commerce</option>
                <option value="Citizenship">Citizenship Studies</option>
                <option value="EnglishLit">English Literature</option>
                <option value="ICT">ICT</option>
                <option value="Health">Health and physical sciences</option>
                <option value="HomeEconomics">Home Economics</option>
                <option value="Tamil">Tamil</option>
                <option value="Art">Art</option>
                <option value="Music">Music</option>


              </select>
            </div>
            <div className="form-group">
              <label>Year</label>
              <select value={year} onChange={(e) => setYear(e.target.value)} required>
                {Array.from({ length: 25 }, (_, i) => 2000 + i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Type</label>
            <select value={option} onChange={handleOptionChange}>
              <option value="pdf">Past Papers (PDF)</option>
              <option value="markingScheme">Marking Schemes (PDF)</option>
              <option value="mcq">MCQ</option>
              <option value="essay">Structured Essay</option>
            </select>
          </div>
          {option === 'pdf' && (
            <div className="form-group">
              <label>Upload Past Paper PDF</label>
              <div className="upload-section">
                <img
                  src={upload_img}
                  alt="Upload Icon"
                  onClick={handleImageClick}
                  className="upload-icon"
                />
                {filePath && <span className="file-path">{filePath}</span>}
                <input
                  type="file"
                  id="fileInput"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  required
                />
              </div>
            </div>
          )}
          {option === 'markingScheme' && (
            <div className="form-group">
              <label>Upload Marking Scheme PDF</label>
              <div className="upload-section">
                <img
                  src={upload_img}
                  alt="Upload Icon"
                  onClick={handleImageClick}
                  className="upload-icon"
                />
                {markingSchemeFilePath && <span className="file-path">{markingSchemeFilePath}</span>}
                <input
                  type="file"
                  id="markingSchemeFileInput"
                  onChange={handleMarkingSchemeFileChange}
                  style={{ display: 'none' }}
                  required
                />
              </div>
            </div>
          )}
          {option === 'mcq' && (
            <div className="mcq-section">
              <h3>MCQ Questions</h3>
              {questions.map((q, index) => (
                <div key={index} className="mcq-question">
                  <input
                    type="text"
                    name="question"
                    placeholder="Question"
                    value={q.question}
                    onChange={(e) => handleQuestionChange(index, e)}
                    required
                  />
                  {q.options.map((opt, i) => (
                    <input
                      key={i}
                      type="text"
                      name={`option${i}`}
                      placeholder={`Option ${i + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const newOptions = [...q.options];
                        newOptions[i] = e.target.value;
                        const newQuestions = [...questions];
                        newQuestions[index].options = newOptions;
                        setQuestions(newQuestions);
                      }}
                      required
                    />
                  ))}
                  <input
                    type="text"
                    name="answer"
                    placeholder="Correct Answer"
                    value={q.answer}
                    onChange={(e) => handleQuestionChange(index, e)}
                    required
                  />
                </div>
              ))}
              <button type="button" onClick={handleAddQuestion}>
                Add Another Question
              </button>
            </div>
          )}
          {option === 'essay' && (
            <div className="essay-section">
              <h3>Structured Essay Questions</h3>
              {essayQuestions.map((q, index) => (
                <textarea
                  key={index}
                  placeholder="Essay Question"
                  value={q}
                  onChange={(e) => handleEssayChange(index, e)}
                  required
                />
              ))}
              <button type="button" onClick={handleAddEssay}>
                Add Another Essay Question
              </button>
            </div>
          )}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Add;
