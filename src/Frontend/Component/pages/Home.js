import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar ';
import InsertTestForm from './InsertTestForm';
import SearchTestForm from './SearchTestForm';

const Home = () => {
  const { userid } = useParams();
  const navigate = useNavigate();
  const [view, setView] = useState('home'); // 'insert' or 'search'
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userid');
    localStorage.removeItem('username');
    navigate('/');
  };

  const renderContent = () => {
    switch(view) {
      case 'insert':
        return <InsertTestForm userid={userid} />;
      case 'search':
        return <SearchTestForm />;
      default:
        return <p>Welcome! Please select an option from the navbar.</p>;
    }
  };

  return (
    <div>
      <h2>Welcome Home, {username}!</h2>
      <p>Your User ID: {userid}</p>
      <Navbar setView={setView} handleLogout={handleLogout} />
      {renderContent()}
    </div>
  );
};

export default Home;
