import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, Card, ListGroup } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import ICPImage from '../../assets/gold.png';
import { football_god_backend as football_god_backend_actor } from '../../../declarations/football_god_backend';

const Home = () => {
  
  const [totalICP, setTotalICP] = useState(0);
  const [fixtures, setFixtures] = useState([]);
  const [activeSeason, setActiveSeason] = useState(null);
  const [activeGameweek, setActiveGameweek] = useState(null);
  const [teamsData, setTeamsData] = useState([]);
  const [isGameweekOpen, setIsGameweekOpen] = useState(false);
  const [isGameweekClosed, setIsGameweekClosed] = useState(false);

  const fetchTotalICP = async () => {
    const icp = await football_god_backend_actor.getGameweekPot();
    setTotalICP(icp);
  };

  const fetchActiveSeason = async () => {
    const season = await football_god_backend_actor.getActiveSeasonInfo();
    setActiveSeason(season[0]);
  };

  const fetchActiveGameweek = async () => {
    const gameweek = await football_god_backend_actor.getActiveGameweekInfo();
    setActiveGameweek(gameweek[0]);
    setIsGameweekOpen(gameweek[0].status === 1);
    setIsGameweekClosed(gameweek[0].status === 2 || gameweek[0].status === 3);
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
  
  useEffect(() => {
    const fetchData = async () => {
      await fetchTotalICP();
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
    activeSeason && activeGameweek ? (
      <Container className="flex-grow-1">
        <br />
        <Row>
          <Col sm={12} md={4} className="mb-3">
            <h5 className="text-center mb-1">{activeSeason.name} Season</h5>
            <h5 className="text-center mb-3">Gameweek {activeGameweek.number}</h5>
            <br />
            <div className="d-flex justify-content-center mb-3">
              <img src={ICPImage} alt="ICP" style={{ maxWidth: '100px', maxHeight: '50px' }} />
            </div>
            <h2 className="mb-3 text-center">{totalICP} ICP</h2>
            <h2 className="mb-3 text-center">Total Pot</h2>
              {isGameweekOpen && (
                <LinkContainer to="/play">
                  <Button variant="primary" className="w-100 mb-3" size="lg">Play</Button>
                </LinkContainer>
              )}
              {isGameweekClosed && (
                <LinkContainer to="/leaderboard">
                  <Button variant="secondary" className="w-100" size="lg">Leaderboard</Button>
                </LinkContainer>
              )}
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
