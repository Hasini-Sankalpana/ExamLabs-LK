import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { StoreContext } from '../../context/StoreContext';
import './Settings.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Settings = () => {
  const { setToken, setProfilePicture } = useContext(StoreContext);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [theme, setTheme] = useState('light');
  const [existingPassword, setExistingPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/api/user/info', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(response.data.user.name);
        setEmail(response.data.user.email);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:4000/api/user/update',
        { name, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Settings saved successfully.');
    } catch (error) {
      toast.error('Failed to save settings. Please try again later.');
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:4000/api/user/change-password',
        { existingPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Password changed successfully.');
      setExistingPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      toast.error('Failed to change password. Please try again later.');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete('http://localhost:4000/api/user/delete', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setToken(null);
        setProfilePicture(null);
        localStorage.removeItem('token');
        localStorage.removeItem('profilePicture');
        toast.success('Account deleted successfully.');
      } catch (error) {
        toast.error('Failed to delete account. Please try again later.');
      }
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadProfilePicture = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', selectedFile);
    formData.append('userId', localStorage.getItem('userId'));

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:4000/api/user/uploadProfilePicture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success('Profile picture updated successfully.');
        setProfilePicture(response.data.profilePicture);
        localStorage.setItem('profilePicture', response.data.profilePicture);
      } else {
        toast.error('Failed to update profile picture.');
      }
    } catch (error) {
      toast.error('Error uploading profile picture. Please try again later.');
    }
  };


  return (
    <div className="settings-container">
      <link href="https://cdn.jsdelivr.net/npm/remixicon/fonts/remixicon.css" rel="stylesheet" />

      <ToastContainer />
      <Sidebar />
      <div className="settings-content">
        <div className="settings-header">
          <h1>Settings Page</h1>
        </div>
        <div className="settings-section">
          <h2>Account Settings</h2>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSave}>Save Settings</button>
        </div>
        <div className="settings-section">
          <h2>Change Password</h2>
          <label htmlFor="existing-password">Existing Password</label>
          <input
            type="password"
            id="existing-password"
            value={existingPassword}
            onChange={(e) => setExistingPassword(e.target.value)}
          />
          <label htmlFor="new-password">New Password</label>
          <div className="password-input-wrapper">
            <input
              type={showNewPassword ? 'text' : 'password'}
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <i
              className={showNewPassword ? 'ri-eye-line' : 'ri-eye-close-line'}
              onClick={() => setShowNewPassword(!showNewPassword)}
            ></i>
          </div>
          <label htmlFor="confirm-new-password">Confirm New Password</label>
          <div className="password-input-wrapper">
            <input
              type={showConfirmNewPassword ? 'text' : 'password'}
              id="confirm-new-password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            <i
              className={showConfirmNewPassword ? 'ri-eye-line' : 'ri-eye-close-line'}
              onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
            ></i>
          </div>
          <button onClick={handleChangePassword}>Change Password</button>
        </div>
        
        <div className="settings-section">
          <h2>Danger Zone</h2>
          <button onClick={handleDeleteAccount} className="delete-account-btn">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
