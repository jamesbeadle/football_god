import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../../contexts/AuthContext";

const Payout = () => {
  const { authClient } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [viewData, setViewData] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      await fetchViewData();
    };
    fetchData();
  }, []);

  const fetchViewData = async () => {
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    const data = await football_god_backend_actor.getPayoutDTO();
    setViewData(data);
    setIsLoading(false);
  };

  const handlePayout = async () => {
    if (window.confirm('Are you sure you want to pay out the sweepstake for the week?')) {
      setIsLoading(true);
      await football_god_backend_actor.payoutSweepstake();
      setIsLoading(false);
      alert('Payout completed successfully!');
    }
  };

  return (
    <Container>
      {isLoading ? (
        <div className="customOverlay d-flex flex-column align-items-center justify-content-center">
          <Spinner animation="border" />
          <p className='text-center mt-1'>Loading Payout</p>
        </div>
      ) : (
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card className="mt-4 custom-card mb-4">
            <Card.Header className="text-center">
              <h2>Payout</h2>
            </Card.Header>
            <Card.Body>
              <p>Current Season: {viewData.activeSeasonName}</p>
              <p>Current Gameweek: {viewData.activeGameweekNumber}</p>
              <p>Total Pot: {(Number(viewData.potAccountBalance) / 1e8)} ICP</p>
              <p>Admin Fee (5%): {(Number(viewData.adminFee) / 1e8)} ICP</p>
              <p>Total Payout (95%): {(Number(viewData.gameweekPot) / 1e8)} ICP</p>
              <p>Number of Winners: {viewData.winnerCount}</p>
              <p>Share per Winner: {(Number(viewData.winnerShare) / 1e8)} ICP</p>
              <div className="text-center mt-3">
                <Button onClick={handlePayout} className="custom-button">
                  Pay Out
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      )}
    </Container>
  );
};

export default Payout;
