import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../../contexts/AuthContext";
import "../../../assets/main.css";
import { useNavigate, useParams } from "react-router-dom";

const UpdateFixture = () => {
  const { seasonId, gameweekNumber, fixtureId } = useParams();
  const navigate = useNavigate();

  const { authClient } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [teams, setTeamsData] = useState([]);
  const [fixture, setFixtureData] = useState([]);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [fixtureStatus, setFixtureStatus] = useState('');
  const [homeGoals, setHomeGoals] = useState('');
  const [awayGoals, setAwayGoals] = useState('');
  
  const handleSubmitFixture = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);

    await football_god_backend_actor.updateFixture(Number(fixtureId), Number(homeTeam), Number(awayTeam), Number(fixtureStatus), Number(homeGoals), Number(awayGoals));

    setHomeTeam('');
    setAwayTeam('');
    setFixtureStatus('');
    setHomeGoals('');
    setAwayGoals('');
    setIsLoading(false);
  };

  const handleDeleteConfirmed = async () => {
    setIsLoading(true);
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    await football_god_backend_actor.deleteFixture(Number(seasonId), Number(gameweekNumber), Number(fixtureId));
    setShowDeleteConfirmModal(false);
    setIsLoading(false);
    navigate(`/fixtures/${seasonId}/${gameweekNumber}`);
  };
  
  const fetchFixture = async () => {
    const fixture = await football_god_backend_actor.getFixture(Number(seasonId), Number(gameweekNumber), Number(fixtureId));
    setFixtureData(fixture);
  };
  
  const fetchTeams = async () => {
    const teamsData = await football_god_backend_actor.getTeams();
    setTeamsData(teamsData);
  };

  useEffect(() => {
    fetchFixture();
    fetchTeams();
  }, []);

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
              <h2>Edit Fixture</h2>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Form onSubmit={handleSubmitFixture} >
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
                    <Form.Group controlId="fixtureStatus">
                        <Form.Label>Status</Form.Label>
                        <Form.Select value={fixtureStatus} onChange={(e) => setFixtureStatus(e.target.value)}>
                            <option value="">Select status</option>
                            <option value="0">Unplayed</option>
                            <option value="1">Active</option>
                            <option value="2">Finished</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group controlId="homeScore">
                      <Form.Label>Home Score</Form.Label>
                      <Form.Control
                          className="w-100"
                          type="number"
                          min="0"
                          placeholder="Home Score"
                          value={homeGoals}
                          onChange={(event) => setHomeGoals(event.target.value)}
                        />
                    </Form.Group>
                    
                    <Form.Group controlId="awayScore">
                      <Form.Label>Away Score</Form.Label>
                      <Form.Control
                          className="w-100"
                          type="number"
                          min="0"
                          placeholder="Away Score"
                          value={awayGoals}
                          onChange={(event) => setAwayGoals(event.target.value)}
                        />
                    </Form.Group>
                </Form>
              </Row>
              <Button variant="primary" className="mb-3" onClick={() => onClick={handleSubmitFixture}}>
                Save Fixture
              </Button>
              <Button variant="primary" className="mb-3" onClick={() => { setShowDeleteConfirmModal(true); }}>
                Delete Fixture
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

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

export default UpdateFixture;
