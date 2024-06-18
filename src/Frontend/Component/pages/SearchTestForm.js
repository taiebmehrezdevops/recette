import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchTestForm.css'; // Assurez-vous d'importer le fichier CSS

function SearchTestForm() {
  const [scenario, setScenario] = useState('');
  const [username, setUsername] = useState('');
  const [etat, setEtat] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const handleScenarioChange = (e) => setScenario(e.target.value);
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleEtatChange = (e) => setEtat(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get('http://127.0.0.1:8800/api/searchTests', {
        params: {
          scenario,
          username,
          etat
        }
      });
      setResults(response.data);
      setMessage(`${response.data.length} tests found`);
    } catch (error) {
      setMessage('Error searching for tests');
      console.error(error);
    }
  };

  const handleViewAttachment = (imagePath) => {
    setSelectedImage(imagePath);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const getRowClass = (etat) => {
    switch (etat) {
      case 'échec':
        return 'table-danger';
      case 'réussi':
        return 'table-success';
      default:
        return '';
    }
  };

  return (
    <div className="container mt-4">
      <h2>Search Tests</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="form-group">
          <label>Scenario:</label>
          <input type="text" className="form-control" value={scenario} onChange={handleScenarioChange} />
        </div>
        <div className="form-group">
          <label>Username:</label>
          <input type="text" className="form-control" value={username} onChange={handleUsernameChange} />
        </div>
        <div className="form-group">
          <label>Etat:</label>
          <select className="form-control" value={etat} onChange={handleEtatChange}>
            <option value="">All</option>
            <option value="en cours">En cours</option>
            <option value="résolu">Résolu</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>
      {message && <p className="alert alert-info">{message}</p>}
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Test ID</th>
            <th>Scenario</th>
            <th>Resultat</th>
            <th>Username</th>
            <th>Etat</th>
            <th>ATI</th>
            <th>GTI</th>
            <th>Date</th>
            <th>Menu</th>
            <th>Sous-menu</th>
            <th>Attachment</th> {/* Ajout de la colonne pour l'attachment */}
          </tr>
        </thead>
        <tbody>
          {results.map(test => (
            <tr key={test.testid} className={getRowClass(test.etat)}>
              <td>{test.testid}</td>
              <td>{test.scenario}</td>
              <td>{test.resultat}</td>
              <td>{test.username}</td>
              <td>{test.etat}</td>
              <td>{test.ati}</td>
              <td>{test.gti}</td>
              <td>{test.date}</td>
              <td>{test.menu_name}</td>
              <td>{test.submenu_name}</td>
              <td>
                {test.image_path && (
                  <button
                    className="btn btn-info btn-sm mr-2"
                    onClick={() => handleViewAttachment(test.image_path)}
                  >
                    <img
                      src={`http://127.0.0.1:8800/${test.image_path}`}
                      alt="Attachment"
                      style={{ width: '50px', height: '50px' }} // Adjust the size as needed
                    />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedImage && (
        <div className="modal" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Attachment</h5>
                <button type="button" className="close" onClick={handleCloseModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <img src={`http://127.0.0.1:8800/${selectedImage}`} alt="Attachment" className="img-fluid" />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchTestForm;
