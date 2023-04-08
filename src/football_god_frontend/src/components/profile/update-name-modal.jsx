import React, { useState, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../../contexts/AuthContext";

const UpdateNameModal = ({ show, onHide, setIsLoading }) => {
  
  const { authClient } = useContext(AuthContext);
  const [displayName, setDisplayName] = useState('');
  const [displayNameError, setDisplayNameError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    setIsLoading(true);
    
    if (!isDisplayNameValid()) {
        setIsLoading(false);
        return;
    }
    
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    await football_god_backend_actor.updateDisplayName(displayName);
    
    hideModal();
  };

  

  const isDisplayNameValid = async () => {
    if(authClient == null){
      return;
    }
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    const isValid = await football_god_backend_actor.isDisplayNameValid(displayName);
  
    if (isValid) {
      setDisplayNameError(null);
    } else {
      setDisplayNameError('Display name must be between 3 and 20 characters long, no special characters and not already taken.');
    }
  
    return isValid;
  };

  const hideModal = () => {
    setDisplayName('');
    setDisplayNameError(null);
    onHide();
  };

  return (
    <Modal show={show} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Set Display Name</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
            <Form.Label>Display Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter display name"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    onBlur={isDisplayNameValid}
                />
                {displayNameError && <Form.Text className="text-danger">{displayNameError}</Form.Text>}
            </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Save</Button>
      </Modal.Footer>
    </Modal>
    
  );
};

export default UpdateNameModal;
