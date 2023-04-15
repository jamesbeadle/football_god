import React, { useState, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../../../contexts/AuthContext";

const CreateSeasonModal = ({ show, onHide, setIsLoading }) => {
  
  const { authClient } = useContext(AuthContext);
  const [seasonName, setSeasonName] = useState('');
  const [seasonYear, setSeasonYear] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    const parsedYear = parseInt(seasonYear, 10);
    
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    await football_god_backend_actor.createSeason(seasonName, parsedYear);
    
    hideModal();
  };

  const hideModal = () => {
    setSeasonName('');
    setSeasonYear('');
    onHide();
  };

  return (
    <Modal show={show} onHide={hideModal}>
      <Modal.Header closeButton>
          <Modal.Title>Create New Season</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="seasonName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter season name"
                value={seasonName}
                onChange={(e) => setSeasonName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="seasonYear">
              <Form.Label>Year</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter season year"
                value={seasonYear}
                onChange={(e) => setSeasonYear(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>Cancel</Button>
            <Button className="custom-button" onClick={handleSubmit}>Save</Button>
        </Modal.Footer>
    </Modal>
  );
};

export default CreateSeasonModal;
