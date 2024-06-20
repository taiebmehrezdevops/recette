import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

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
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

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
      // Reset the form
      setScenario('');
      setResultat('');
      setUsername('');
      setImage(null);
      setSelectedMenu('');
      setSelectedSubmenu('');
      setEtat('en cours');
      setAti('');
      setGti('');
    } catch (error) {
      setMessage('Error inserting new test');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h4>Insérer un Scénario</h4>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <h5>Menu:</h5>
          <select className="form-control" value={selectedMenu} onChange={handleMenuChange} required>
            <option value="">Select Menu</option>
            {menus.map(menu => (
              <option key={menu.menuid} value={menu.menuid}>{menu.menu}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <h5>Sous-Menu:</h5>
          <select className="form-control" value={selectedSubmenu} onChange={handleSubmenuChange} required>
            <option value="">Select Sous-Menu</option>
            {submenus.map(submenu => (
              <option key={submenu.ssmenuid} value={submenu.ssmenuid}>{submenu.ssmenu}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <h5>Scénario:</h5>
          <textarea className="form-control" rows="1" value={scenario} onChange={handleScenarioChange} required />
        </div>
        <div className="form-group">
          <h5>Résultat:</h5>
          <textarea className="form-control" rows="5" value={resultat} onChange={handleResultatChange} required />
        </div>
        <div className="form-group">
          <h5>Etat:</h5>
          <select className="form-control" value={etat} onChange={handleEtatChange} required>
            <option value="en cours">en cours</option>
            <option value="résolu">résolu</option>
          </select>
        </div><br/>
        <div className="form-group">
          <h5>Imprime écran:</h5>
          <input type="file" className="form-control-file" onChange={handleImageChange} required />
        </div><br/>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}

export default InsertTestForm;
