import React, { useState, useContext } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../../contexts/AuthContext";

const WithdrawICPModal = ({ show, onHide, balance, wallet }) => {
  
  const { authClient } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const withdrawalFee = 0.0001; 

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    await football_god_backend_actor.withdrawICP(withdrawAmount - withdrawalFee);
    hideModal();
  };

  const hideModal = () => {
    setWithdrawAmount(0);
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
        <Modal.Title>Withdraw ICP</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div className="table-responsive">
        <Form onSubmit={handleSubmit}>
            <p><strong>Account Balance:</strong> {(Number(balance) / 1e8).toFixed(4)} ICP</p>
            
            <p className='mt-1'><strong>Withdrawal Address:</strong><br />
              <small className='text-break'>{wallet}</small></p>
            
            <Form.Group className='mt-3' controlId="withdrawAmount">
            <Form.Label>Amount</Form.Label>
            <Form.Control
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter amount to withdraw"
                value={withdrawAmount}
                onChange={(event) => setWithdrawAmount(event.target.value)}
            />
            </Form.Group>
            <p>We will take the withdrawal fee of {withdrawalFee} ICP off your withdrawal amount.</p>
        </Form>
      </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Withdraw</Button>
      </Modal.Footer>
    </Modal>
    
  );
};

export default WithdrawICPModal;
