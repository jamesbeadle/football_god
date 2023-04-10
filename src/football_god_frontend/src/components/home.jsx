import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, ListGroup, Spinner } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import ICPImage from '../../assets/gold.png';
import { football_god_backend as football_god_backend_actor } from '../../../declarations/football_god_backend';
import { AuthContext } from "../contexts/AuthContext";

const Home = () => {
  
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, login } = useContext(AuthContext);
  
  const [totalICP, setTotalICP] = useState(0);
  const [activeSeason, setActiveSeason] = useState(null);
  const [activeGameweek, setActiveGameweek] = useState(null);
  const [teams, setTeamsData] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [isGameweekPlayable, setIsGameweekPlayable] = useState(false);
  const [isGameweekClosed, setIsGameweekClosed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await fetchTeams();
      await fetchTotalICP();
      await fetchActiveSeason();
      await fetchActiveGameweek();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    fetchFixtures();
  }, [activeSeason, activeGameweek]);

  const fetchActiveSeason = async () => {
    const season = await football_god_backend_actor.getActiveSeason();
    setActiveSeason(season[0]);
  };

  const fetchActiveGameweek = async () => {
    const gameweek = await football_god_backend_actor.getActiveGameweek();
    setActiveGameweek(gameweek[0]);
    if(gameweek[0] && Object.keys(gameweek[0].length > 0)){
      setIsGameweekPlayable(gameweek[0].status === 1);
      setIsGameweekClosed(gameweek[0].status === 2 || gameweek[0].status === 3);
    }
  };

  const fetchTotalICP = async () => {
    const icp = await football_god_backend_actor.getGameweekPot();
    setTotalICP(Number(icp));
  };
  
  const fetchTeams = async () => {
    const teamsData = await football_god_backend_actor.getTeams();
    setTeamsData(teamsData);
  };

  const fetchFixtures = async () => {
    if (activeSeason && activeGameweek) {
      const fetchedFixtures = await football_god_backend_actor.getFixtures(activeSeason.id, activeGameweek.number);
      setFixtures(fetchedFixtures);
    }
  };

  const getTeamNameById = (teamId) => {
    const team = teams.find((team) => team.id === teamId);
    return team ? team.name : '';
  };

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
              {!isAuthenticated && (
                  <Button onClick={() => { login(); }} variant="primary" className="w-100 mb-3" size="lg">Sign In To Play</Button>
              )}
              {isGameweekPlayable && isAuthenticated && (
                <LinkContainer to="/play">
                  <Button variant="primary" className="w-100 mb-3" size="lg">Play</Button>
                </LinkContainer>
              )}
              {isGameweekClosed && (
                <LinkContainer to="/leaderboard">
                  <Button variant="primary" className="w-100" size="lg">Leaderboard</Button>
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
                  {fixture.status === 2 && (
                    <span>
                      <br />
                      {fixture.homeGoals}-{fixture.awayGoals}
                    </span>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Container>) : isLoading ? (
        <div className="customOverlay">
          <Spinner animation="border" />
        </div>
      ) : (
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
