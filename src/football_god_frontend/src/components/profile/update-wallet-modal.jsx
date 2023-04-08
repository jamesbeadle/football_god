import React, { useState, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../../contexts/AuthContext";

const UpdateNameModal = ({ show, onHide, setIsLoading }) => {
  
  const { authClient } = useContext(AuthContext);
  const [walletAddress, setWalletAddress] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    setIsLoading(true);
    
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    await football_god_backend_actor.updateWalletAddress(walletAddress);
    
    hideModal();
  };

  const hideModal = () => {
    setWalletAddress('');
    onHide();
  };

  return (
    <Modal show={show} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Set Withdrawal Wallet Address</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
            <Form.Label>Wallet Address</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter wallet address"
                    value={walletAddress}
                    onChange={(event) => setWalletAddress(event.target.value)}
                />
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
