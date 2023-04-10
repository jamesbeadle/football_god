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
    console.log(profile)
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
      isLoading ? (
        <div className="customOverlay">
          <Spinner animation="border" />
        </div>
      ) : (
        <Container>
        <Row className="justify-content-md-center">
          <Col md={8}>
            <Card className="mt-4">
              <Card.Header className="text-center">
                <h2>Profile</h2>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">

                  <ListGroup.Item>
                    <h6>Principal Id:</h6>
                    <p><small>{principalName}</small></p>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <h6>Deposit Address:</h6>
                    <p><small>{toHexString(depositAddress)}{' '}
                    <CopyIcon onClick={() => navigator.clipboard.writeText(toHexString(depositAddress))} /></small></p>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <h6>Display Name:</h6>
                    <p>
                      <small>{displayName}</small>
                      <Button className="btn btn-primary btn-sm ml-3" onClick={() => setShowUpdateNameModal(true)}>Update</Button>
                    </p>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <h6>Account Balance:</h6>
                    <p>
                      <small>{(Number(balance) / 1e8).toFixed(4)} ICP</small>
                      <Button className="btn btn-primary btn-sm ml-3" onClick={() => setShowWithdrawICPModal(true)}>Withdraw</Button>
                    </p>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <h6>Withdraw Wallet Address:</h6>
                    <p>
                      <small>{wallet ? wallet : 'Not Set'}</small>
                      <Button className="btn btn-primary btn-sm ml-3" onClick={() => setShowUpdateWalletModal(true)}>Update</Button>
                    </p>
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
    )
  );
};

export default Profile;
