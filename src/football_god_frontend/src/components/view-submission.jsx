import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, ListGroup, Spinner } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../declarations/football_god_backend';

const ViewSubmission = () => {
  const { seasonId, gameweekNumber } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [seasonName, setSeasonName] = useState('');
  const [teams, setTeamsData] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalFixtures, setTotalFixtures] = useState(0);
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
  
    const fetchData = async () => {
      await fetchSeason();
      await fetchTeams();
      await fetchFixtures();
      await fetchPredictions();
    };
    fetchData();
  }, []);

  
  useEffect(() => {
    if (fixtures.length > 0 && predictions.length > 0) {
      calculateTotals();
      setIsLoading(false);
    }
  }, [fixtures, predictions]);

  const fetchSeason = async () => {
    const seasonData = await football_god_backend_actor.getSeason(Number(seasonId));
    setSeasonName(seasonData[0].name);
  };
  
  const fetchTeams = async () => {
    const teamsData = await football_god_backend_actor.getTeams();
    setTeamsData(teamsData);
  };

  const fetchFixtures = async () => {
    const fixturesData = await football_god_backend_actor.getFixtures(Number(seasonId), Number(gameweekNumber));
    setFixtures(fixturesData);
  };
  
  const fetchPredictions = async () => {
    const predictionsData = await football_god_backend_actor.getPredictions(Number(seasonId), Number(gameweekNumber));
    setPredictions(predictionsData);
  };

  const calculateTotals = async () => {
    let correctCount = 0;
  
    predictions.forEach((prediction) => {
      const fixture = fixtures.find(
        (fixture) =>
          fixture.homeTeam === prediction.homeTeam &&
          fixture.awayTeam === prediction.awayTeam
      );
  
      if (fixture && fixture.status > 0) {
        if (
          prediction.homeGoals === fixture.homeGoals &&
          prediction.awayGoals === fixture.awayGoals
        ) {
          correctCount++;
        }
      }
    });
    
    setTotalCorrect(correctCount);
    setTotalFixtures(fixtures.length);
  };
  
  const getPredictionStatus = (prediction) => {
    const fixture = fixtures.find((fixture) => fixture.id === prediction.fixtureId);
      
    if (!fixture || fixture.status < 2) {
      return 'unplayed';
    }
  
    const correct =
      prediction.homeGoals === fixture.homeGoals &&
      prediction.awayGoals === fixture.awayGoals;
  
    if (correct) {
      return 'correct';
    } else {
      return 'incorrect';
    }
  };

  const getTeamName = (fixture, teamType) => {
    if (!fixture) return '';
  
    const teamId = teamType === 'home' ? fixture.homeTeamId : fixture.awayTeamId;
    const team = teams.find((team) => team.id === teamId);
  
    return team ? team.name : '';
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
              <h2>Your Predictions</h2>
            </Card.Header>
            <Card.Body>
              <p>Season: {seasonName}</p>
              <p>Gameweek: {gameweekNumber}</p>
              <p>
                Total Correct: {totalCorrect} / {totalFixtures}
              </p>
              <ListGroup>
                {predictions.map((prediction) =>{ 
                  const fixture = fixtures.find((fixture) => fixture.id === prediction.fixtureId);
                  return (
                  <ListGroup.Item key={prediction.fixtureId} className={`prediction-${getPredictionStatus(prediction)}`}>
                    <div>{getTeamName(fixture, 'home')} vs {getTeamName(fixture, 'away')}</div>
                    <div>Prediction: {prediction.homeGoals} - {prediction.awayGoals}</div>
                    {prediction.played && <div>Actual Score: {prediction.actualHomeGoals} - {prediction.actualAwayGoals}</div>}
                  </ListGroup.Item>
                )})}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    )}
    </Container>
  );
};

export default ViewSubmission;
