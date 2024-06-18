// InsertTestForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function InsertTestForm() {
  const { userid: paramUserid } = useParams();
  const navigate = useNavigate();
  const [userid, setUserid] = useState(paramUserid || localStorage.getItem('userid'));
  const [scenario, setScenario] = useState('');
  const [resultat, setResultat] = useState('');
  const [username, setUsername] = useState('');
  const [image, setImage] = useState(null);
  const [menus, setMenus] = useState([]);
  const [submenus, setSubmenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState('');
  const [selectedSubmenu, setSelectedSubmenu] = useState('');
  const [message, setMessage] = useState('');
  const [etat, setEtat] = useState('en cours');
  const [ati, setAti] = useState('');
  const [gti, setGti] = useState('');

  useEffect(() => {
    if (!userid) {
      navigate('/'); // Redirect to login if userid is not found
    }
  }, [userid, navigate]);

  useEffect(() => {
    // Fetch menus from backend
    axios.get('http://127.0.0.1:8800/api/menus')
      .then(response => setMenus(response.data))
      .catch(error => console.error('Error fetching menus:', error));
  }, []);

  useEffect(() => {
    if (selectedMenu) {
      // Fetch submenus from backend when a menu is selected
      axios.get(`http://127.0.0.1:8800/api/submenus/${selectedMenu}`)
        .then(response => setSubmenus(response.data))
        .catch(error => console.error('Error fetching submenus:', error));
    } else {
      // Clear submenus if no menu is selected
      setSubmenus([]);
    }
  }, [selectedMenu]);

  const handleScenarioChange = (e) => setScenario(e.target.value);
  const handleResultatChange = (e) => setResultat(e.target.value);
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleImageChange = (e) => setImage(e.target.files[0]);
  const handleMenuChange = (e) => setSelectedMenu(e.target.value);
  const handleSubmenuChange = (e) => setSelectedSubmenu(e.target.value);
  const handleEtatChange = (e) => setEtat(e.target.value);
  const handleAtiChange = (e) => setAti(e.target.value);
  const handleGtiChange = (e) => setGti(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('scenario', scenario);
    formData.append('resultat', resultat);
    formData.append('username', username);
    formData.append('image', image);
    formData.append('menuid', selectedMenu);
    formData.append('ssmenuid', selectedSubmenu);
    formData.append('userid', userid);
    formData.append('Etat', etat);
    formData.append('ATI', ati);
    formData.append('GTI', gti);

    try {
      const response = await axios.post('http://127.0.0.1:8800/test', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage(`New test inserted with ID: ${response.data.testId}`);
    } catch (error) {
      setMessage('Error inserting new test');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Insert New Test</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Menu:</label>
          <select value={selectedMenu} onChange={handleMenuChange} required>
            <option value="">Select Menu</option>
            {menus.map(menu => (
              <option key={menu.menuid} value={menu.menuid}>{menu.menu}</option>
            ))}
          </select>
          <label>Submenu:</label>
          <select value={selectedSubmenu} onChange={handleSubmenuChange} required>
            <option value="">Select Submenu</option>
            {submenus.map(submenu => (
              <option key={submenu.ssmenuid} value={submenu.ssmenuid}>{submenu.ssmenu}</option>
            ))}
          </select>
        </div><br/>
        <div>
          <label>Scenario:</label>
          <textarea type="text" rows="1" cols="70" value={scenario} onChange={handleScenarioChange} />
        </div><br/>
        <div>
          <label>Resultat:</label>
          <textarea rows="5" cols="90" value={resultat} onChange={handleResultatChange} required />
        </div><br/>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={handleUsernameChange} />
        </div><br/>
        <div>
          <label>Etat:</label>
          <select value={etat} onChange={handleEtatChange} required>
            <option value="en cours">en cours</option>
            <option value="résolu">résolu</option>
          </select>
        </div><br/>
        <div>
          <label>ATI:</label>
          <input type="text" value={ati} onChange={handleAtiChange} />
        </div><br/>
        <div>
          <label>GTI:</label>
          <input type="text" value={gti} onChange={handleGtiChange} />
        </div><br/>
        <div>
          <label>Image:</label>
          <input type="file" onChange={handleImageChange} required />
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default InsertTestForm;
