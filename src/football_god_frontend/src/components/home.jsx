import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, Card, ListGroup } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import ICPImage from '../../assets/gold.png';
import { football_god_backend as football_god_backend_actor } from '../../../declarations/football_god_backend';

const Home = () => {
  // Replace this with actual data
  const [totalICP, setTotalICP] = useState(0);
  const [fixtures, setFixtures] = useState([]);
  const [currentSeason, setCurrentSeason] = useState(null);
  const [currentGameweek, setCurrentGameweek] = useState(null);
  const [teamsData, setTeamsData] = useState([]);

  const fetchTotalICP = async () => {
    const icp = await football_god_backend_actor.getGameweekPot();
    setTotalICP(icp);
  };

  const fetchCurrentSeason = async () => {
    const season = await football_god_backend_actor.getCurrentSeason();
    setCurrentSeason(season[0]);
  };

  const fetchCurrentGameweek = async () => {
    const gameweek = await football_god_backend_actor.getCurrentGameweek();
    setCurrentGameweek(gameweek[0]);
  };

  const fetchFixtures = async () => {
    if (currentSeason && currentGameweek) {
      const fetchedFixtures = await football_god_backend_actor.getFixtures(currentSeason.id, currentGameweek.id);
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
  
  useEffect(() => {
    const fetchData = async () => {
      await fetchTotalICP();
      await fetchCurrentSeason();
      await fetchCurrentGameweek();
    };
    fetchData();
  }, []);

  useEffect(() => {
    fetchTeams();
    fetchFixtures();
  }, [currentSeason, currentGameweek]);



  return (
    currentSeason && currentGameweek ? (
      <Container className="flex-grow-1">
        <br />
        <Row>
          <Col sm={12} md={4} className="mb-3">
            <h5 className="text-center mb-1">{currentSeason.name} Season</h5>
            <h5 className="text-center mb-3">Gameweek {currentGameweek.number}</h5>
            <br />
            <div className="d-flex justify-content-center mb-3">
              <img src={ICPImage} alt="ICP" style={{ maxWidth: '100px', maxHeight: '50px' }} />
            </div>
            <h2 className="mb-3 text-center">{totalICP} ICP</h2>
            <h2 className="mb-3 text-center">Total Pot</h2>
            <LinkContainer to="/play">
              <Button variant="primary" className="w-100" size="lg">Play</Button>
            </LinkContainer>
            <br />
          </Col>
          <Col sm={12} md={8}>
            <h2 className="text-center mb-3">Fixtures</h2>
            <ListGroup>
              {fixtures.map((fixture, index) => (
                <ListGroup.Item key={index} className="text-center">
                  {getTeamNameById(fixture.homeTeamId)} vs {getTeamNameById(fixture.awayTeamId)}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Container>) : (
      <Container className="flex-grow-1">
        <br />
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
          <h2>System being updated</h2>
        </div>
      </Container>
    )
  );
};

export default Home;
