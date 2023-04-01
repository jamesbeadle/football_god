import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../declarations/football_god_backend';

const Submission = () => {
  const { userId, seasonId, gameweekId } = useParams();
  const [playerName, setPlayerName] = useState('');
  const [season, setSeason] = useState('');
  const [gameweek, setGameweek] = useState('');
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalFixtures, setTotalFixtures] = useState(0);
  const [predictions, setPredictions] = useState([]);

  // Fetch the necessary data here using the provided IDs (userId, seasonId, gameweekId)
  // and update the corresponding states

  const getPredictionStatus = (prediction) => {
    if (!prediction.played) {
      return 'unplayed';
    } else if (prediction.correct) {
      return 'correct';
    } else {
      return 'incorrect';
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card className="mt-4">
            <Card.Header className="text-center">
              <h2>{playerName}'s Submission</h2>
            </Card.Header>
            <Card.Body>
              <p>Season: {season}</p>
              <p>Gameweek: {gameweek}</p>
              <p>
                Total Correct: {totalCorrect} / {totalFixtures}
              </p>
              <ListGroup>
                {predictions.map((prediction) => (
                  <ListGroup.Item key={prediction.id} className={`prediction-${getPredictionStatus(prediction)}`}>
                    <div>{prediction.homeTeam} vs {prediction.awayTeam}</div>
                    <div>Prediction: {prediction.homeGoals} - {prediction.awayGoals}</div>
                    {prediction.played && <div>Actual Score: {prediction.actualHomeGoals} - {prediction.actualAwayGoals}</div>}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Submission;
