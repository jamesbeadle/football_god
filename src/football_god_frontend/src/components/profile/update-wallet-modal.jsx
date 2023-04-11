import React, { useState, useContext } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../../contexts/AuthContext";

const UpdateNameModal = ({ show, onHide }) => {
  
  const { authClient } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletError, setWalletError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    setIsLoading(true);
    let validWallet = await isWalletValid();
    
    if (!validWallet) {
      setIsLoading(false);
      return;
    }
    
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    await football_god_backend_actor.updateWalletAddress(walletAddress);
    
    hideModal();
  };

  
  const isWalletValid = async () => {
    if(authClient == null){
      return;
    }
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    const isValid = await football_god_backend_actor.isWalletValid(walletAddress);
  
    if (isValid) {
      setWalletError(null);
    } else {
      setWalletError('Invalid wallet address.');
    }
  
    return isValid;
  };

  const hideModal = () => {
    setWalletAddress('');
    onHide();
  };

  return (
    <Modal show={show} onHide={hideModal}>
      {isLoading && (
        <div className="customOverlay">
          <Spinner animation="border" />
        </div>
      )}
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
                {walletError && <Form.Text className="text-danger">{walletError}</Form.Text>}
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
