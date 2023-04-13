import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, ListGroup, Spinner } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import ICPImage from '../../assets/gold.png';
import { football_god_backend as football_god_backend_actor } from '../../../declarations/football_god_backend';
import { AuthContext } from "../contexts/AuthContext";

const Home = () => {
  
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, login } = useContext(AuthContext);
  const [viewData, setViewData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await fetchViewData();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const fetchViewData = async () => {
    const data = await football_god_backend_actor.getHomeDTO();
    setViewData(data);
  };
  
  return (
    isLoading ? (
      <div className="customOverlay d-flex flex-column align-items-center justify-content-center">
        <Spinner animation="border" />
        <p className='text-center mt-1'>Loading</p>
      </div>) 
      : viewData.systemUpdating ? (
      <Container className="flex-grow-1">
        <br />
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
          <h2>System being updated</h2>
        </div>
      </Container>) :
      <Container className="flex-grow-1">
        <br />
        <Row>
          <Col sm={12} md={4} className="mb-3">
            <h5 className="text-center mb-1">{viewData.activeSeasonName} Season</h5>
            <h5 className="text-center mb-3">Gameweek {viewData.activeGameweekNumber}</h5>
            <br />
            <div className="d-flex justify-content-center mb-3">
              <img src={ICPImage} alt="ICP" style={{ maxWidth: '100px', maxHeight: '50px' }} />
            </div>
            <h2 className="mb-3 text-center">{(Number(viewData.gameweekPot) / 1e8).toFixed(0)} ICP</h2>
            <h2 className="mb-3 text-center">Total Pot</h2>
              {!isAuthenticated && (
                  <Button onClick={() => { login(); }} variant="primary" className="w-100 mb-3" size="lg">Sign In To Play</Button>
              )}
              {viewData.gameweekStatus === 1 && isAuthenticated && (
                <LinkContainer to="/play">
                  <Button variant="primary" className="w-100 mb-3" size="lg">Play</Button>
                </LinkContainer>
              )}
              {(viewData.gameweekStatus === 2 || viewData.gameweekStatus === 3) && (
                <LinkContainer to="/leaderboard">
                  <Button variant="primary" className="w-100" size="lg">Leaderboard</Button>
                </LinkContainer>
              )}
            <br />
          </Col>
          <Col sm={12} md={8}>
            <h2 className="text-center mb-3">Fixtures</h2>
            <ListGroup>
              {viewData.fixtures.map((fixture, index) => (
                <ListGroup.Item key={index} className="text-center">
                  {fixture.homeTeamName} vs {fixture.awayTeamName}
                  {fixture.status === 2 && (
                    <span>
                      <br />
                      {fixture.homeTeamGoals}-{fixture.awayTeamGoals}
                    </span>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Container>
      
  );
};

export default Home;
