import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function TestDetails({ show, handleClose, test }) {
  if (!test) return null;

  return (
    <Modal show={show} onHide={handleClose} dialogClassName="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title>Details Scénario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Scénario:</strong> {test.scenario}</p>
        <p><strong>Resulat:</strong> {test.resultat}</p>
        <p><strong>Menu:</strong> {test.menu_name}</p>
        <p><strong>Submenu:</strong> {test.submenu_name}</p>
        {test.image_path && (
          <div>
            <strong>Attachment:</strong>
            <img
              src={`http://127.0.0.1:8800/${test.image_path}`}
              alt="Attachment"
              className="img-fluid"
            />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TestDetails;
