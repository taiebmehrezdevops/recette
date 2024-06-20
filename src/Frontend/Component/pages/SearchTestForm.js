import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import TestDetails from './TestDetails'; // Import the TestDetails component
import './AttachmentViewer.css'; // Import your custom styles
import jsPDF from 'jspdf'; // Import jsPDF for PDF generation
import 'jspdf-autotable';

function SearchTestForm() {
  const [scenario, setScenario] = useState('');
  const [username, setUsername] = useState('');
  const [etat, setEtat] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDetails, setShowDetails] = useState(false); // State to control the TestDetails modal
  const [selectedTest, setSelectedTest] = useState(null); // State to store the selected test details

  // Modal state for modification
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [modifiedEtat, setModifiedEtat] = useState('');
  const [modifiedGti, setModifiedGti] = useState('');

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

  const handleShowDetails = (test) => {
    setSelectedTest(test);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedTest(null);
  };

  const getRowClass = (etat) => {
    switch (etat) {
      case 'en cours':
        return 'table-danger';
      case 'résolu':
        return 'table-success';
      case 'résolu':
        return 'table-warning';
      default:
        return '';
    }
  };

  const handleModifyModalOpen = (test) => {
    // Pré-remplir le modal avec les informations du test sélectionné
    setModifiedEtat(test.etat);
    setModifiedGti(test.GTI);
    setShowModifyModal(true);
    setSelectedTest(test);
  };

  const handleModifyModalClose = () => {
    setShowModifyModal(false);
    setSelectedTest(null);
    setModifiedEtat('');
    setModifiedGti('');
  };

  const handleModifySubmit = async () => {
    try {
      // Envoyer les données modifiées au serveur
      await axios.put(`http://127.0.0.1:8800/api/updateTest/${selectedTest.testid}`, {
        etat: modifiedEtat,
        gti: modifiedGti
      });

      // Rafraîchir les résultats après la modification
      const response = await axios.get('http://127.0.0.1:8800/api/searchTests', {
        params: {
          scenario,
          username,
          etat
        }
      });
      setResults(response.data);
      setMessage(`${response.data.length} tests found`);

      // Fermer le modal de modification
      handleModifyModalClose();
    } catch (error) {
      console.error('Error updating test:', error);
    }
  };
  const handlePrintPDF = () => {
    const doc = new jsPDF();
    const data = results.map(test => [test.testid, test.scenario,  test.resultat, test.gti, test.username]);
    const columns = ['ID', 'Scénario', 'Résultat', 'Remarque GTI', 'Utilisateur'];

    doc.autoTable({
      head: [columns],
      body: data,
      styles: {
        lineColor: [0, 0, 0],  // Black border
        lineWidth: 0.1,       // Border width
      },
    });

    doc.save('recette_agora_bourse.pdf');
  };
  return (
    <div className="container mt-4">
      <button className="btn btn-success btn-sm ml-2" onClick={handlePrintPDF}>
        Print PDF
      </button>
      <h4>choix d'un critère de recherche:</h4>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="form-group">
          <h5>Scénario:</h5>
          <input type="text" className="form-control" value={scenario} onChange={handleScenarioChange} />
        </div>
        <div className="form-group">
          <h5>Utilisateur:</h5>
          <input type="text" className="form-control" value={username} onChange={handleUsernameChange} />
        </div>
        <div className="form-group">
          <h5>Etat:</h5>
          <select className="form-control" value={etat} onChange={handleEtatChange}>
            <option value="">All</option>
            <option value="en cours">En cours</option>
            <option value="résolu">Résolu</option>
          </select>
        </div><br/>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>
    
      <table id="testTable"className="table table-bordered text-center" border="2">
        <thead className="thead-dark" >
          <tr>
            <th>ID</th>
            <th>Scénario</th>
            <th>Utilisateur</th>
            <th>Etat</th>
            <th>Remarque GTI</th>
            <th>Date</th>
            <th>Détail</th>
            <th>Modifier</th> {/* Nouvelle colonne pour le bouton Modifier */}
          </tr>
        </thead>
        <tbody>
          {results.map(test => (
            <tr key={test.testid} className={getRowClass(test.etat)}>
              <td>{test.testid}</td>
              <td>{test.scenario}</td>
              <td>{test.username}</td>
              <td>{test.etat}</td>
              <td>{test.gti}</td>
              <td>{test.date}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleShowDetails(test)}
                >
                  Détail
                </button>
              </td>
              <td>
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => handleModifyModalOpen(test)}
                >
                  Modifier
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de modification */}
      <Modal show={showModifyModal} onHide={handleModifyModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier l'état et la Remarque GTI</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <h5>État du test:</h5>
              <select
                className="form-control"
                value={modifiedEtat}
                onChange={(e) => setModifiedEtat(e.target.value)}
              >
                <option value="en cours">En cours</option>
                <option value="résolu">Résolu</option>
              </select>
            </div>
            <div className="form-group">
              <h5>Remarque GTI:</h5>
              <textarea
                className="form-control"
                value={modifiedGti}
                onChange={(e) => setModifiedGti(e.target.value)}
              ></textarea>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModifyModalClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleModifySubmit}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>

      <TestDetails
        show={showDetails}
        handleClose={handleCloseDetails}
        test={selectedTest}
      />
    </div>
  );
}

export default SearchTestForm;
