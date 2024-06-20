import React from 'react';
import './Navbar.css'; // Import the CSS file

const Navbar = ({ setView, handleLogout }) => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <button onClick={() => setView('insert')}>Insérer un Scénario</button>
        </li>
        <li>
          <button onClick={() => setView('search')}>Recherche d'un Scénario</button>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
