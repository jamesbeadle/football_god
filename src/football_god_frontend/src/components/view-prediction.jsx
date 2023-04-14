import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, ListGroup, Spinner } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../declarations/football_god_backend';

const ViewPrediction = () => {
  const { userId, seasonId, gameweekNumber } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [viewData, setViewData] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      await fetchViewData();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const fetchViewData = async () => {
    const data = await football_god_backend_actor.getViewPredictionDTO(userId, Number(seasonId), Number(gameweekNumber));
    setViewData(data);
  };

  return (
    <Container>
      {isLoading ? (
        <div className="customOverlay d-flex flex-column align-items-center justify-content-center">
          <Spinner animation="border" />
          <p className='text-center mt-1'>Loading Prediction</p>
        </div>
      ) : (
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card className="mt-4">
            <Card.Header className="text-center">
              <h2>View Prediction</h2>
            </Card.Header>
            <Card.Body>
              <p>Player: {viewData.playerName}</p>
              <p>Season: {viewData.seasonName}</p>
              <p>Gameweek: {gameweekNumber}</p>
              <p>
                Total Correct: {viewData.correctScores} / {viewData.totalFixtures}
              </p>
              <ListGroup>
                {viewData.fixtures.map((prediction) =>{ 
                  const cssClass = prediction.status == 0 ? 'unplayed' : prediction.correct ? 'correct' : 'incorrect';
                  return (
                  <ListGroup.Item key={prediction.fixtureId} className={`prediction-${cssClass}`}>
                    <div>{prediction.homeTeamName} vs {prediction.awayTeamName}</div>
                    <div>Prediction: {prediction.homeTeamPrediction} - {prediction.awayTeamPrediction}</div>
                    {prediction.status > 0 && <div>Actual Score: {prediction.homeTeamGoals} - {prediction.awayTeamGoals}</div>}
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

export default ViewPrediction;
