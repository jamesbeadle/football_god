import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../contexts/AuthContext";

const Profile = () => {
  const { authClient } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [wallet, setWallet] = useState('');
  const [balance, setBalance] = useState(0);
  const [depositAddress, setDepositAddress] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const withdrawalFee = 0.001; // Set the withdrawal fee here
  
  
  const fetchBalance = async () => {
    const userBalance = await football_god_backend_actor.getBalance();
    setBalance(userBalance);
  };

  const fetchDepositAddress = async () => {
    const address = await football_god_backend_actor.getDepositAddress();
    setDepositAddress(address);
  };

  const handleWithdraw = async () => {
    setIsLoading(true);
    await football_god_backend_actor.withdrawICP(withdrawAmount);
    setIsLoading(false);
    setShowWithdrawModal(false);
    fetchBalance();
  };

  useEffect(() => {
    fetchBalance();
    fetchDepositAddress();
  }, []);

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
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Display Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter display name"
                      value={displayName}
                      onChange={(event) => setDisplayName(event.target.value)}
                    />
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
                      <FormControl
                        type="text"
                        readOnly
                        value={depositAddress}
                      />
                      <InputGroup.Append>
                        <Button variant="outline-secondary" onClick={() => navigator.clipboard.writeText(depositAddress)}>
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
