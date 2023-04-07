import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, InputGroup, Modal } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../contexts/AuthContext";
import { toHexString } from './helpers';

const Profile = () => {

  const { authClient } = useContext(AuthContext);
  const identity = authClient.getIdentity();
  Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
  
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [depositAddress, setDepositAddress] = useState('');
  const [wallet, setWallet] = useState('');
  const [balance, setBalance] = useState(0);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const withdrawalFee = 0.001; // Set the withdrawal fee here
  const [displayNameError, setDisplayNameError] = useState(null);
  
  useEffect(() => {
    fetchProfile();
    fetchBalance();
  }, []);
  
  const fetchProfile = async () => {
    const profile = await football_god_backend_actor.getProfile();
    if(profile && Object.keys(profile).length > 0){
      setDisplayName(profile[0].displayName);
      setDepositAddress(profile[0].depositAddress);
      setWallet(profile[0].wallet);
      setUserProfile(profile[0]);
    }
  };
  
  const fetchBalance = async () => {
    const userBalance = await football_god_backend_actor.getUserAccountBalance();
    console.log(Number(userBalance));
    setBalance(userBalance);
  };

  const isDisplayNameValid = async () => {
    
    const isValid = await football_god_backend_actor.isDisplayNameValid(displayName);
    console.log(isValid);
  
    if (isValid) {
      setDisplayNameError(null);
    } else {
      setDisplayNameError('Display name must be at least 3 characters long, no special characters and not already taken.');
    }
  
    return isValid;
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
  
    if (!isDisplayNameValid()) {
      return;
    }
  
    setIsLoading(true);
    await football_god_backend_actor.saveProfile(displayName, wallet);
    setIsLoading(false);
  
  };

  const handleWithdraw = async () => {
    setIsLoading(true);
    await football_god_backend_actor.withdrawICP(withdrawAmount);
    setIsLoading(false);
    setShowWithdrawModal(false);
    fetchBalance();
  };

  return (
    <Container>
      {isLoading && (
        <div className="customOverlay">
          <Spinner animation="border" />
        </div>
      )}
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card className="mt-4">
            <Card.Header className="text-center">
              <h2>Profile</h2>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleProfileSubmit}>
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
                  <Form.Group className="mb-3">
                    <Form.Label>Wallet</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter wallet address"
                      value={wallet}
                      onChange={(event) => setWallet(event.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>ICP Balance</Form.Label>
                    <Form.Control
                        type="text"
                        readOnly
                        value={`${balance} ICP`}
                      />
                  </Form.Group>
                
                  <Form.Group className="mb-3">
                    <Form.Label>Deposit Address</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        readOnly
                        value={toHexString(depositAddress)}
                      />
                      <InputGroup.Append>
                        <Button variant="outline-secondary" onClick={() => navigator.clipboard.writeText(toHexString(depositAddress))}>
                          Copy
                        </Button>
                      </InputGroup.Append>
                    </InputGroup>
                  </Form.Group>
                
                  <div className="text-center mt-3">
                    <Button type="submit" variant="primary">Save Profile</Button>
                    <Button className="ml-2" variant="warning" onClick={() => setShowWithdrawModal(true)}>Withdraw</Button>
                  </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showWithdrawModal} onHide={() => setShowWithdrawModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Withdraw ICP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
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
          <p>Withdrawal Fee: {withdrawalFee} ICP</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowWithdrawModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleWithdraw}>
            Withdraw
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Profile;
