import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Spinner, Dropdown } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../../contexts/AuthContext";
import "../../../assets/main.css";

const Fixtures = () => {
  const { authClient } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [seasonsData, setSeasonsData] = useState([]);
  const [teamsData, setTeamsData] = useState([]);
  const [fixturesData, setFixturesData] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedGameweek, setSelectedGameweek] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  const [editedFixture, setEditedFixture] = useState(null);
  const [fixtureToDelete, setFixtureToDelete] = useState(null);

  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [gameweek, setGameweek] = useState('');

  const addFixture = () => setShowAddModal(true);

  const editFixture = async (fixture) => {
    setEditedFixture(fixture);
    setHomeTeam(fixture.homeTeam);
    setAwayTeam(fixture.awayTeam);
    setGameweek(fixture.gameweek);
    setShowEditModal(true);
  };

  const deleteFixture = async (fixtureId) => {
    setFixtureToDelete(fixtureId);
    setShowDeleteConfirmModal(true);
  };

  const handleSubmitFixture = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);

    if (editedFixture) {
      await football_god_backend_actor.updateFixture(Number(selectedSeason), Number(gameweek), Number(editedFixture.id), Number(homeTeam), Number(awayTeam));
    } else {
      await football_god_backend_actor.addFixtureToGameweek(Number(selectedSeason), Number(gameweek), Number(homeTeam), Number(awayTeam));
    }

    fetchFixtures();
    setHomeTeam('');
    setAwayTeam('');
    setGameweek('');
    setEditedFixture(null);
    setShowAddModal(false);
    setShowEditModal(false);
    setIsLoading(false);
  };

  const handleDeleteConfirmed = async () => {
    setIsLoading(true);
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    await football_god_backend_actor.deleteFixture(fixtureToDelete);
    fetchFixtures();
    setShowDeleteConfirmModal(false);
    setIsLoading(false);
  };

  const fetchFixtures = async () => {
    if (selectedSeason && selectedGameweek) {
      const fixtures = await football_god_backend_actor.getFixtures(Number(selectedSeason), Number(selectedGameweek));
      console.log(fixtures);
      setFixturesData(fixtures);
    } else {
      setFixturesData([]);
    }
  };
  
  const fetchSeasons = async () => {
    const seasons = await football_god_backend_actor.getSeasons();
    setSeasonsData(seasons);
  };
  
  const fetchTeams = async () => {
    const teams = await football_god_backend_actor.getTeams();
    setTeamsData(teams);
  };

  useEffect(() => {
    fetchFixtures();
  }, [selectedSeason, selectedGameweek]);

  useEffect(() => {
    fetchSeasons();
    fetchTeams();
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
              <h2>Fixtures</h2>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
              <Col>
                <Form.Control as="select" value={selectedSeason} onChange={(e) => setSelectedSeason(e.target.value)}>
                  <option value="">Select Season</option>
                  {seasonsData.map((season) => (
                    <option key={season.id} value={season.id}>
                      {season.name}
                    </option>
                  ))}
                </Form.Control>
              </Col>
              <Col>
                <Form.Control as="select" value={selectedGameweek} onChange={(e) => setSelectedGameweek(e.target.value)}>
                  <option value="">Select Gameweek</option>
                  {Array.from({ length: 38 }, (_, i) => i + 1).map((number) => (
                    <option key={number} value={number}>
                      {number}
                    </option>
                  ))}
                </Form.Control>
              </Col>
              </Row>
              <Button variant="primary" className="mb-3" onClick={addFixture}>
                Add New Fixture
              </Button>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Home Team</th>
                      <th>Away Team</th>
                      <th>Home Goals</th>
                      <th>Away Goals</th>
                      <th>Status</th>
                      <th>Options</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fixturesData.map((fixture) => (
                      <tr key={fixture.id}>
                        <td>{getTeamNameById(fixture.homeTeamId)}</td>
                        <td>{getTeamNameById(fixture.awayTeamId)}</td>
                        <td>{fixture.homeGoals}</td>
                        <td>{fixture.awayGoals}</td>
                        <td>{fixture.status}</td>
                        <td>
                          <Dropdown alignRight className="custom-dropdown">
                            <Dropdown.Toggle variant="secondary" id="dropdown-basic">Options</Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item href="#" onClick={() => editFixture(fixture)}>Edit</Dropdown.Item>
                              <Dropdown.Item href="#" onClick={() => deleteFixture(fixture.id)}>Delete</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
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

      <Modal show={showAddModal} onHide={() => { setShowAddModal(false); }}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Fixture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={handleSubmitFixture}>
          {/* Replace the options below with actual team data */}
          <Form.Group controlId="homeTeam">
            <Form.Label>Home Team</Form.Label>
            <Form.Control as="select" value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)}>
              <option value="">Select Home Team</option>
              {teamsData.map((team) => (
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
              {teamsData.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="gameweek">
            <Form.Label>Gameweek</Form.Label>
            <Form.Control as="select" value={gameweek} onChange={(e) => setGameweek(e.target.value)}>
              <option value="">Select Gameweek</option>
              {Array.from({ length: 38 }, (_, i) => i + 1).map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowAddModal(false); }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitFixture}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => { setEditedFixture(null); setShowEditModal(false); }}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Fixture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitFixture} >
            <Form.Group controlId="homeTeam">
              <Form.Label>Home Team</Form.Label>
              <Form.Control as="select" value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)}>
                <option value="">Select Home Team</option>
                {teamsData.map((team) => (
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
                {teamsData.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="gameweek">
              <Form.Label>Gameweek</Form.Label>
              <Form.Control as="select" value={gameweek} onChange={(e) => setGameweek(e.target.value)}>
                <option value="">Select Gameweek</option>
                {Array.from({ length: 38 }, (_, i) => i + 1).map((number) => (
                  <option key={number} value={number}>
                    {number}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setEditedFixture(null); setShowEditModal(false); }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitFixture}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteConfirmModal} onHide={() => { setShowDeleteConfirmModal(false); }}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Fixture</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this fixture?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowDeleteConfirmModal(false);
            }}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirmed}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default Fixtures;
