import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, ListGroup } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../../contexts/AuthContext";
import { toHexString } from '../helpers';
import UpdateNameModal from './update-name-modal';
import UpdateWalletModal from './update-wallet-modal';
import WithdrawICPModal from './withdraw-icp-modal';
import CopyIcon from '../icons';

const Profile = () => {

  const { authClient } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  
  const [principalName, setPrincipalName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [depositAddress, setDepositAddress] = useState('');
  const [wallet, setWallet] = useState('');
  const [balance, setBalance] = useState(0);

  const [showUpdateNameModal, setShowUpdateNameModal] = useState(false);
  const [showUpdateWalletModal, setShowUpdateWalletModal] = useState(false);
  const [showWithdrawICPModal, setShowWithdrawICPModal] = useState(false);

  const hideUpdateNameModal = async () => {
    setShowUpdateNameModal(false); 
    await fetchProfile();
    setIsLoading(false);
  };

  const hideUpdateWalletModal = async () => {
    setShowUpdateWalletModal(false); 
    await fetchProfile();
    setIsLoading(false);
  };

  const hideWithdrawICPModal = async () => {
    setShowWithdrawICPModal(false); 
    await fetchBalance();
    setIsLoading(false);
  };
  
  const fetchProfile = async () => {
    if(authClient == null){
      return;
    }
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    const profile = await football_god_backend_actor.getProfile();
    if(profile && Object.keys(profile).length > 0){
      setPrincipalName(profile[0].principalName);
      setDisplayName(profile[0].displayName);
      setDepositAddress(profile[0].depositAddress);
      setWallet(profile[0].wallet);
    }
  };
  
  const fetchBalance = async () => {
    if(authClient == null){
      return;
    }
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    const userBalance = await football_god_backend_actor.getUserAccountBalance();
    setBalance(userBalance);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchProfile();
      await fetchBalance();
      setIsLoading(false);
    };
    fetchData();
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
              <ListGroup variant="flush">

                <ListGroup.Item>
                  <strong>Principal Id:</strong> {principalName}
                </ListGroup.Item>

                <ListGroup.Item>
                  <strong>Deposit Address:</strong> {toHexString(depositAddress)}{' '}
                  <CopyIcon onClick={() => navigator.clipboard.writeText(toHexString(depositAddress))} />
                </ListGroup.Item>

                <ListGroup.Item>
                  <strong>Account Balance:</strong> {(Number(balance) / 1e8).toFixed(4)} ICP
                  <Button className="ml-2" variant="warning" onClick={() => setShowWithdrawICPModal(true)}>Withdraw</Button>
                </ListGroup.Item>

                <ListGroup.Item>
                  <strong>Display Name:</strong> {displayName }
                  <Button className="ml-2" variant="primary" onClick={() => setShowUpdateNameModal(true)}>Update</Button>
                </ListGroup.Item>

                <ListGroup.Item>
                  <strong>Withdraw Wallet Address:</strong> {wallet ? wallet : 'Not Set'}
                  <Button className="ml-2" variant="primary" onClick={() => setShowUpdateWalletModal(true)}>Update</Button>
                </ListGroup.Item>
              </ListGroup>
              
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <UpdateNameModal
        show={showUpdateNameModal}
        onHide={hideUpdateNameModal}
        setIsLoading={setIsLoading}
      />

      <UpdateWalletModal
        show={showUpdateWalletModal}
        onHide={hideUpdateWalletModal}
        setIsLoading={setIsLoading}
      />

      <WithdrawICPModal
        show={showWithdrawICPModal}
        onHide={hideWithdrawICPModal}
        setIsLoading={setIsLoading}
        balance={balance}
      />

    </Container>
  );
};

export default Profile;
