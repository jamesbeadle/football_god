import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../../contexts/AuthContext";

const Payout = () => {
  const { authClient } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('');
  const [season, setSeason] = useState(null);
  const [gameweek, setGameweek] = useState(null);
  const [totalPot, setTotalPot] = useState(0);
  const [adminFee, setAdminFee] = useState(0);
  const [totalPayout, setTotalPayout] = useState(0);
  const [numWinners, setNumWinners] = useState(0);
  const [sharePerWinner, setSharePerWinner] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      await fetchActiveSeason();
      await fetchActiveGameweek();
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!season || !gameweek) {
        return;
      }
      await fetchPayoutData();
      setIsLoading(false);
    };
    fetchData();
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

      var totalPot = (Number(payoutData[0].totalPot) / 1e8).toFixed(4);

      setTotalPot(totalPot);
      setAdminFee(totalPot * 0.05);
      setTotalPayout(totalPot * 0.95);
      setNumWinners(Number(payoutData[0].winners));
      setSharePerWinner(totalPot / Number(payoutData[0].winners));
    }
  };

  const handlePayout = async () => {
    if (window.confirm('Are you sure you want to pay out the sweepstake for the week?')) {
      setIsLoading(true);
      await football_god_backend_actor.payoutSweepstake(season.id, gameweek.number);
      setIsLoading(false);
      alert('Payout completed successfully!');
    }
  };

  return (
    <Container>
      {isLoading ? (
        <div className="customOverlay d-flex flex-column align-items-center justify-content-center">
          <Spinner animation="border" />
          <p className='text-center mt-1'>{loadingText}</p>
        </div>
      ) : (
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
      )}
    </Container>
  );
};

export default Payout;
