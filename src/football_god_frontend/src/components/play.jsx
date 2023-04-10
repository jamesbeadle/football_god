import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

const Play = () => {
  
  const { authClient } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [activeSeason, setActiveSeason] = useState(null);
  const [activeGameweek, setActiveGameweek] = useState(null);
  const [teams, setTeamsData] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [scores, setScores] = useState({});
  const [hasPaid, setHasPaid] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
      const fetchData = async () => {
        await checkProfile();
        await fetchActiveSeason();
        await fetchActiveGameweek();
      };
      fetchData();
  }, []);

  useEffect(() => {
    if (!activeSeason || !activeGameweek) {
      return;
    }
  
    const fetchData = async () => {
      await fetchTeams();
      const fetchedFixtures = await fetchFixtures();
      await fetchExistingPredictions(fetchedFixtures);
      setIsLoading(false);
    };
    fetchData();
  }, [activeSeason, activeGameweek]);

  const checkProfile = async () => {
    if(authClient == null){
      return;
    }
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    const profile = await football_god_backend_actor.getProfile();
    if(profile == null){
      navigate('/');
    }
  };

  const fetchActiveSeason = async () => {
    const season = await football_god_backend_actor.getActiveSeason();
    setActiveSeason(season[0]);
  };

  const fetchActiveGameweek = async () => {
    const gameweek = await football_god_backend_actor.getActiveGameweek();
    setActiveGameweek(gameweek[0]);
  };
  
  const fetchTeams = async () => {
    const teamsData = await football_god_backend_actor.getTeams();
    setTeamsData(teamsData);
  };

  const fetchFixtures = async () => {
    if (activeSeason && activeGameweek) {
      const fetchedFixtures = await football_god_backend_actor.getFixtures(activeSeason.id, activeGameweek.number);
      setFixtures(fetchedFixtures);
      return fetchedFixtures;
    }
  };

  const fetchExistingPredictions = async (fixtures) => {
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    const fetchedPredictions = await football_god_backend_actor.getPredictions(activeSeason.id, activeGameweek.number);
    const existingScores = fetchedPredictions.reduce((acc, prediction) => {
      acc[prediction.fixtureId] = { home: prediction.homeGoals, away: prediction.awayGoals };
      return acc;
    }, {});
  
    // Set initial score values for all fixtures
    fixtures.forEach(fixture => {
      if (!existingScores[fixture.id]) {
        existingScores[fixture.id] = { home: 0, away: 0 };
      }
    });
  
    setScores(existingScores);
    if (existingScores) {
      await checkSweepstakePaid();
    }
  };

  const checkSweepstakePaid = async () => {
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    const paid = await football_god_backend_actor.checkSweepstakePaid(Number(activeSeason.id), Number(activeGameweek.number));
    setHasPaid(paid);
    if(!paid){
      await fetchBalance();
    }
  };
  
  const fetchBalance = async () => {
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    const userBalance = await football_god_backend_actor.getUserAccountBalance();
    setBalance((Number(userBalance) / 1e8));
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

    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    await football_god_backend_actor.submitPredictions(
      Number(activeSeason.id),
      Number(activeGameweek.number),
      predictions
    );
    setIsLoading(false);
    navigate(`/view-submission/${Number(activeSeason.id)}/${Number(activeGameweek.number)}`);
    
  };

  const handleSweepstakeSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    const predictions = Object.entries(scores).map(([fixtureId, score]) => ({
      fixtureId: Number(fixtureId),
      homeGoals: Number(score.home),
      awayGoals: Number(score.away)
    }));

    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    await football_god_backend_actor.submitPredictions(
      Number(activeSeason.id),
      Number(activeGameweek.number),
      predictions
    );

    await football_god_backend_actor.enterSweepstake(Number(activeSeason.id), Number(activeGameweek.number));
    setIsLoading(false);
    navigate(`/view-submission/${Number(activeSeason.id)}/${Number(activeGameweek.number)}`);
  };

  const getTeamNameById = (teamId) => {
    const team = teams.find((team) => team.id === teamId);
    return team ? team.name : '';
  };
  
  const incrementScore = (fixtureId, team) => {
    setScores((prevScores) => {
      const updatedScores = { ...prevScores };
      if (!updatedScores[fixtureId]) {
        updatedScores[fixtureId] = { home: 0, away: 0 };
      }
      updatedScores[fixtureId][team] += 1;
      return updatedScores;
    });
  };
  
  const decrementScore = (fixtureId, team) => {
    setScores((prevScores) => {
      const updatedScores = { ...prevScores };
      if (!updatedScores[fixtureId]) {
        updatedScores[fixtureId] = { home: 0, away: 0 };
      }
      updatedScores[fixtureId][team] = Math.max(0, updatedScores[fixtureId][team] - 1);
      return updatedScores;
    });
  };

  return (
    <Container>
      {isLoading ? (
        <div className="customOverlay">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row className="justify-content-md-center">
        <Col md={8}>
          <Card className="mt-4">
            <Card.Header className="text-center">
              <h2>Play</h2>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handlePlayForFreeSubmit}>
                <Form.Row className="mb-2">
                  <Col xs={4} className="text-center font-weight-bold">
                    Home Score
                  </Col>
                  <Col xs={4} className="text-center font-weight-bold">
                    Fixture
                  </Col>
                  <Col xs={4} className="text-center font-weight-bold">
                    Away Score
                  </Col>
                </Form.Row>
                {fixtures.map((fixture) => (
                   <Form.Group key={fixture.id} as={Row} className="mb-3 fixture-row">
                   <Col xs={4} className="text-center button-column">
                     <Form.Group className="w-100 d-flex flex-column">
                       <Button onClick={() => incrementScore(fixture.id, 'home')} style={{width: '100%', padding: '0', height: '3rem'}}>+</Button>
                       <Form.Control
                         style={{height: '3rem', textAlign: 'center'}}
                         type="number"
                         min="0"
                         placeholder=""
                         value={scores[fixture.id]?.home}
                         onChange={(event) => handleChange(event, fixture.id, 'home')}
                         className="d-block mx-auto custom-number-input w-100"
                       />
                       <Button onClick={() => decrementScore(fixture.id, 'home')} style={{width: '100%', padding: '0', height: '3rem'}}>-</Button>
                     </Form.Group>
                   </Col>
                   <Col xs={4} className="text-center d-flex align-items-center justify-content-center flex-column column-border">
                     <span>{getTeamNameById(fixture.homeTeamId)}</span>
                     <span>vs</span>
                     <span>{getTeamNameById(fixture.awayTeamId)}</span>
                   </Col>
                   <Col xs={4} className="text-center button-column">
                     <Form.Group className="w-100 d-flex flex-column">
                       <Button onClick={() => incrementScore(fixture.id, 'away')} style={{width: '100%', padding: '0', height: '3rem'}}>+</Button>
                       <Form.Control
                         style={{height: '3rem', textAlign: 'center'}}
                         type="number"
                         min="0"
                         placeholder=""
                         value={scores[fixture.id]?.away}
                         onChange={(event) => handleChange(event, fixture.id, 'away')}
                         className="d-block mx-auto custom-number-input w-100"
                       />
                       <Button onClick={() => decrementScore(fixture.id, 'away')} style={{width: '100%', padding: '0', height: '3rem'}}>-</Button>
                     </Form.Group>
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
      )}

    </Container>
  );
};

export default Play;
