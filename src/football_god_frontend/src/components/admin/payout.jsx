import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../../contexts/AuthContext";

const Payout = () => {
  const { authClient } = useContext(AuthContext);

  const [season, setSeason] = useState(null);
  const [gameweek, setGameweek] = useState(null);
  const [totalPot, setTotalPot] = useState(0);
  const [adminFee, setAdminFee] = useState(0);
  const [totalPayout, setTotalPayout] = useState(0);
  const [numWinners, setNumWinners] = useState(0);
  const [sharePerWinner, setSharePerWinner] = useState(0);

  useEffect(() => {
    fetchActiveSeason();
    fetchActiveGameweek();
  }, []);

  useEffect(() => {
    fetchPayoutData();
  }, [season, gameweek]);

  const fetchActiveSeason = async () => {
    const fetchedSeason = await football_god_backend_actor.getActiveSeason();
    setSeason(fetchedSeason[0]);
  };

  const fetchActiveGameweek = async () => {
    const fetchedGameweek = await football_god_backend_actor.getActiveGameweek();
    setGameweek(fetchedGameweek[0]);
  };

  const fetchPayoutData = async () => {
    if (season && gameweek) {
      const identity = authClient.getIdentity();
      Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
      const payoutData = await football_god_backend_actor.getPayoutData(season.id, gameweek.number);
      setTotalPot(payoutData.totalPot);
      setAdminFee(payoutData.totalPot * 0.05);
      setTotalPayout(payoutData.totalPot * 0.95);
      setNumWinners(payoutData.winners);
      setSharePerWinner(payoutData.totalPot / payoutData.winners);
    }
  };

  const handlePayout = async () => {
    if (window.confirm('Are you sure you want to pay out the sweepstake for the week?')) {
      await football_god_backend_actor.payOutSweepstake(season.id, gameweek.number);
      alert('Payout completed successfully!');
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card className="mt-4">
            <Card.Header className="text-center">
              <h2>Payout</h2>
            </Card.Header>
            <Card.Body>
              <p>Current Season: {season && season.name}</p>
              <p>Current Gameweek: {gameweek && gameweek.number}</p>
              <p>Total Pot: {totalPot} ICP</p>
              <p>Admin Fee (5%): {adminFee.toFixed(2)} ICP</p>
              <p>Total Payout (95%): {totalPayout.toFixed(2)} ICP</p>
              <p>Number of Winners: {numWinners}</p>
              <p>Share per Winner: {sharePerWinner.toFixed(2)} ICP</p>
              <div className="text-center mt-3">
                <Button onClick={handlePayout} variant="primary">
                  Pay Out
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Payout;
