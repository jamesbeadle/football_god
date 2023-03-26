import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../contexts/AuthContext";

const Play = () => {
  
  const { authClient } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [scores, setScores] = useState({});
  const [fixtures, setFixtures] = useState([]);
  const [activeSeason, setActiveSeason] = useState(null);
  const [activeGameweek, setActiveGameweek] = useState(null);
  const [teamsData, setTeamsData] = useState([]);

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
  
  const fetchTeams = async () => {
    const teams = await football_god_backend_actor.getTeams();
    setTeamsData(teams);
  };

  const getTeamNameById = (teamId) => {
    const team = teamsData.find((team) => team.id === teamId);
    return team ? team.name : '';
  };
  

  const handleChange = (event, fixtureId, team) => {
    const updatedScores = { ...scores };
    if (!updatedScores[fixtureId]) {
      updatedScores[fixtureId] = {};
    }
    updatedScores[fixtureId][team] = parseInt(event.target.value);
    setScores(updatedScores);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);

    // Convert scores to an array of Prediction objects
    const predictions = Object.entries(scores).map(([fixtureId, score]) => ({
      fixtureId: parseInt(fixtureId),
      homeGoals: score.home,
      awayGoals: score.away
    }));
    
    try {
    
      const result = await football_god_backend_actor.submitPredictions(
        activeSeason.id,
        activeGameweek.number,
        predictions
      );

      if (result.ok) {
        console.log('Predictions submitted successfully');
      } else {
        console.error('Error submitting predictions:', result.err);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchActiveSeason();
      await fetchActiveGameweek();
    };
    fetchData();
  }, []);

  useEffect(() => {
    fetchTeams();
    fetchFixtures();
  }, [activeSeason, activeGameweek]);


  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card className="mt-4">
            <Card.Header className="text-center">
              <h2>Play</h2>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
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
                      {fixture.home} vs {fixture.away}
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
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Play;
