// src/components/AttachmentViewer.js

import React from 'react';


const AttachmentViewer = ({ show, handleClose, attachmentUrl }) => {
  return (
    <Modal show={show} onHide={handleClose} dialogClassName="fullscreen-modal">
      <Modal.Header closeButton>
        <Modal.Title>Attachment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {attachmentUrl ? (
          <img src={attachmentUrl} alt="Attachment" className="img-fluid" />
        ) : (
          <p>No attachment available</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AttachmentViewer;
