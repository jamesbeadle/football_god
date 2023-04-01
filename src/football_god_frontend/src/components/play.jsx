import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../contexts/AuthContext";

const Play = () => {
  
  const { authClient } = useContext(AuthContext);
  const identity = authClient.getIdentity();
  Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);

  const [isLoading, setIsLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [scores, setScores] = useState({});
  const [fixtures, setFixtures] = useState([]);
  const [activeSeason, setActiveSeason] = useState(null);
  const [activeGameweek, setActiveGameweek] = useState(null);
  const [teams, setTeamsData] = useState([]);
  const [hasPaid, setHasPaid] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    checkProfile();
  }, []);

  useEffect(() => {
    if(hasProfile){
      fetchTeams();
      const fetchData = async () => {
        await fetchActiveSeason();
        await fetchActiveGameweek();
      };
      fetchData();
    }
  }, [hasProfile]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchFixtures();
      await fetchExistingPredictions();
      await checkSweepstakePayment();
      await fetchBalance();
    };
    fetchData();
  }, [activeSeason, activeGameweek]);

  const checkProfile = async () => {
    const profileExists = await football_god_backend_actor.checkForProfile();
    setHasProfile(profileExists);
  };
  
  const fetchTeams = async () => {
    const teamsData = await football_god_backend_actor.getTeams();
    setTeamsData(teamsData);
  };

  const fetchActiveSeason = async () => {
    const season = await football_god_backend_actor.getActiveSeason();
    setActiveSeason(season[0]);
  };

  const fetchActiveGameweek = async () => {
    const gameweek = await football_god_backend_actor.getActiveGameweek();
    setActiveGameweek(gameweek[0]);
  };

  const fetchFixtures = async () => {
    if (activeSeason && activeGameweek) {
      const fetchedFixtures = await football_god_backend_actor.getFixtures(activeSeason.id, activeGameweek.number);
      setFixtures(fetchedFixtures);
    }
  };

  const fetchExistingPredictions = async () => {
    if (activeSeason && activeGameweek) {
      const fetchedPredictions = await football_god_backend_actor.getPredictions(activeSeason.id, activeGameweek.number);
      const existingScores = fetchedPredictions.reduce((acc, prediction) => {
        acc[prediction.fixtureId] = { home: prediction.homeGoals, away: prediction.awayGoals };
        return acc;
      }, {});
      setScores(existingScores);
    }
  };

  const checkSweepstakePayment = async () => {
    const paid = await football_god_backend_actor.checkSweepstakePayment(Number(activeSeason.id), Number(activeGameweek.number));
    setHasPaid(paid);
  };
  
  const fetchBalance = async () => {
    const userBalance = await football_god_backend_actor.getBalance();
    setBalance(userBalance);
  };

  const handleChange = (event, fixtureId, team) => {
    const updatedScores = { ...scores };
    if (!updatedScores[fixtureId]) {
      updatedScores[fixtureId] = {};
    }
    updatedScores[fixtureId][team] = parseInt(event.target.value);
    setScores(updatedScores);
  };
  
  const handlePlayForFreeSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const predictions = Object.entries(scores).map(([fixtureId, score]) => ({
      fixtureId: Number(fixtureId),
      homeGoals: Number(score.home),
      awayGoals: Number(score.away)
    }));

    await football_god_backend_actor.submitPredictions(
      Number(activeSeason.id),
      Number(activeGameweek.number),
      predictions
    );
    setIsLoading(false);
    
  };

  const handleSweepstakeSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    await handlePlayForFreeSubmit(event);
    await football_god_backend_actor.enterSweepstake(Number(activeSeason.id), Number(activeGameweek.number));
    setIsLoading(false);
    checkSweepstakePayment();
  };

  const getTeamNameById = (teamId) => {
    const team = teams.find((team) => team.id === teamId);
    return team ? team.name : '';
  };
  


  return (
    <Container>
      {isLoading && (
        <div className="customOverlay">
          <Spinner animation="border" />
        </div>
      )}
      {hasProfile ? (
        <Row className="justify-content-md-center">
        <Col md={8}>
          <Card className="mt-4">
            <Card.Header className="text-center">
              <h2>Play</h2>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handlePlayForFreeSubmit}>
                {fixtures.map((fixture) => (
                  <Form.Group key={fixture.id} as={Row} className="mb-3">
                    <Col xs={3}>
                      <Form.Control
                        className="w-100"
                        type="number"
                        min="0"
                        placeholder="Home"
                        value={scores[fixture.id]?.homeGoals}
                        onChange={(event) => handleChange(event, fixture.id, 'home')}
                      />
                    </Col>
                    <Col xs={6} className="text-center">
                      {getTeamNameById(fixture.homeTeamId)} vs {getTeamNameById(fixture.awayTeamId)}
                    </Col>
                    <Col xs={3}>
                      <Form.Control 
                        className="w-100"
                        type="number"
                        min="0"
                        placeholder="Away"
                        value={scores[fixture.id]?.awayGoals}
                        onChange={(event) => handleChange(event, fixture.id, 'away')}
                      />
                    </Col>
                  </Form.Group>
                ))}
                <div className="text-center">
                  <Button type="submit" variant="primary">Save Scores</Button>
                  {hasPaid ? (
                    <p className="mt-2">You have already paid for the sweepstake.</p>
                    ) : (
                    <div className="mt-2">
                      {balance >= 1 ? (
                        <Button variant="success" onClick={handleSweepstakeSubmit}>Save & Enter Sweepstake</Button>
                      ) : (
                        <p>You do not have enough ICP to enter the sweepstake.</p>
                      )}
                      </div>
                    )}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        </Row>
      ) : (
        <Row className="justify-content-md-center">
          <Col md={8}>
            <Card className="mt-4">
              <Card.Header className="text-center">
                <h2>Play</h2>
              </Card.Header>
              <Card.Body>
                <p>You must set up your profile before you can play.</p> 
                <LinkContainer to={'profile'}>
                    <Button variant="primary" className="mb-4 w-100">
                        Profile
                    </Button>
                </LinkContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

    </Container>
  );
};

export default Play;
