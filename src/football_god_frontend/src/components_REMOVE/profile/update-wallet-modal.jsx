import React, { useState, useContext } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../../contexts_REMOVE/AuthContext";

const UpdateNameModal = ({ show, onHide, wallet }) => {
  const { authClient } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [newWallet, setNewWallet] = useState(wallet);
  const [walletError, setWalletError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if(wallet == newWallet){
      hideModal();
      return;
    }
    
    setIsLoading(true);
    let validWallet = await isWalletValid();
    
    if (!validWallet) {
      setIsLoading(false);
      return;
    }
    
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    await football_god_backend_actor.updateWalletAddress(newWallet);
    
    setNewWallet('');
    setWalletError(null);
    onHide(true);
  };

  
  const isWalletValid = async () => {
    if(authClient == null){
      return;
    }
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    const isValid = await football_god_backend_actor.isWalletValid(newWallet);
  
    if (isValid) {
      setWalletError(null);
    } else {
      setWalletError('Invalid wallet address.');
    }
  
    return isValid;
  };

  const hideModal = () => {
    setNewWallet(wallet);
    setWalletError(null);
    onHide(false);
  };

  return (
    <Modal show={show} onHide={hideModal}>
      {isLoading && (
        <div className="customOverlay d-flex flex-column align-items-center justify-content-center">
          <Spinner animation="border" />
          <p className='text-center mt-1'>Saving Wallet Address</p>
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
                    value={newWallet}
                    onChange={(event) => setNewWallet(event.target.value)}
                />
                {walletError && <Form.Text className="text-danger">{walletError}</Form.Text>}
            </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hideModal}>Cancel</Button>
        <Button className="custom-button" onClick={handleSubmit}>Save</Button>
      </Modal.Footer>
    </Modal>
    
  );
};

export default UpdateNameModal;
