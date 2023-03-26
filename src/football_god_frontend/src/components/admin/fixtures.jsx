import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Spinner, Dropdown } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../../contexts/AuthContext";
import "../../../assets/main.css";
import { useParams } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { getFixtureStatus } from '../helpers';

const EditFixtures = () => {
  const { seasonId, gameweekNumber } = useParams();

  const { authClient } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [teams, setTeamsData] = useState([]);
  const [season, setSeasonData] = useState([]);
  const [fixturesData, setFixturesData] = useState([]);
  const [showAddFixtureModal, setShowAddFixtureModal] = useState(false);

  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');

  const addFixture = () => setShowAddFixtureModal(true);

  const handleSubmitFixture = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    await football_god_backend_actor.addFixtureToGameweek(Number(seasonId), Number(gameweekNumber), Number(homeTeam), Number(awayTeam));

    fetchFixtures();
    setHomeTeam('');
    setAwayTeam('');
    setShowAddFixtureModal(false);
    setIsLoading(false);
  };
  
  const fetchTeams = async () => {
    const teamsData = await football_god_backend_actor.getTeams();
    setTeamsData(teamsData);
  };
  
  const fetchSeason = async () => {
    const seasonData = await football_god_backend_actor.getSeasonInfo(Number(seasonId));
    setSeasonData(seasonData[0]);
  };

  const fetchFixtures = async () => {
    const fixtures = await football_god_backend_actor.getFixtures(Number(seasonId), Number(gameweekNumber));
    setFixturesData(fixtures);
  };

  useEffect(() => {
    fetchTeams();
    fetchSeason();
    fetchFixtures();
  }, []);

  const getTeamNameById = (teamId) => {
    const team = teamsData.find((team) => team.id === teamId);
    return team ? team.name : '';
  };

  return (
    <Container>
      {isLoading && (
        <div className="customOverlay">
          <Spinner animation="border" />
        </div>
      )}
      <Row className="justify-content-md-center">
        <Col md={12}>
          <Card className="mt-4">
            <Card.Header className="text-center">
              <h2>Edit Fixtures</h2>
            </Card.Header>
            <Card.Body>
                <p className="mt-3">
                    <strong>Season:</strong> {season.name}
                </p>
                <p className="mt-3">
                    <strong>Gameweek:</strong> {gameweekNumber}
                </p>
                
                <Button variant="primary" className="mb-3" onClick={addFixture}>
                    New Fixture
                </Button>
                <div className="table-responsive">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                            <th>Home Team</th>
                            <th>Away Team</th>
                            <th>Status</th>
                            <th>Home Goals</th>
                            <th>Away Goals</th>
                            <th>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fixturesData.map((fixture) => (
                            <tr key={fixture.id}>
                                <td>{getTeamNameById(fixture.homeTeamId)}</td>
                                <td>{getTeamNameById(fixture.awayTeamId)}</td>
                                <td>{getFixtureStatus(fixture.status)}</td>
                                <td>{fixture.homeGoals}</td>
                                <td>{fixture.awayGoals}</td>
                                <td>
                                    <LinkContainer to={`/update-fixture/${seasonId}/${gameweekNumber}/${fixture.id}`}>
                                        <Button variant="primary" className="mb-4 w-100">
                                            Edit
                                        </Button>
                                    </LinkContainer>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showAddFixtureModal} onHide={() => { setShowAddFixtureModal(false); }}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Fixture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={handleSubmitFixture}>
          <Form.Group controlId="homeTeam">
            <Form.Label>Home Team</Form.Label>
            <Form.Control as="select" value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)}>
              <option value="">Select Home Team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="awayTeam">
            <Form.Label>Away Team</Form.Label>
            <Form.Control as="select" value={awayTeam} onChange={(e) => setAwayTeam(e.target.value)}>
              <option value="">Select Away Team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowAddFixtureModal(false); }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitFixture}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default EditFixtures;
