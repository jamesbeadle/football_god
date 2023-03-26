import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Table, Dropdown, Modal, Spinner, Form } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { getGameweekStatus } from '../helpers';
import { football_god_backend as football_god_backend_actor } from '../../../../declarations/football_god_backend';
import { AuthContext } from "../../contexts/AuthContext";
import { Actor } from "@dfinity/agent";

const Season = () => {
  
  const { authClient } = useContext(AuthContext);
  const navigate = useNavigate();
  const { seasonId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [season, setSeasonData] = useState([]);
  const [gameweeks, setGameweeksData] = useState([]);
  const [showGameweekStatusModal, setShowGameweekStatusModal] = useState(false);
  const [showUpdateSeasonModal, setShowUpdateSeasonModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [updatedGameweek, setGameweekToUpdate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [seasonName, setSeasonName] = useState('');
  const [seasonYear, setSeasonYear] = useState('');

  const fetchSeason = async () => {
    const seasonData = await football_god_backend_actor.getSeasonInfo(Number(seasonId));
    setSeasonData(seasonData);
  };

  const fetchGameweeks = async () => {
    const gameweeksData = await football_god_backend_actor.getGameweeksInfo(Number(seasonId));
    setGameweeksData(gameweeksData);
  };

  const updateStatus = async (gameweek) => {
    setGameweekToUpdate(gameweek.number);
    setSelectedStatus(gameweek.status);
    setShowGameweekStatusModal(true);
  };  

  
  const submitUpdateSeason = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);

    await football_god_backend_actor.updateSeason(Number(seasonId), seasonName, Number(seasonYear));

    fetchSeason();
    setShowUpdateSeasonModal(false);
    setIsLoading(false);
  };

  
  const submitUpdateGameweekStatus = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    
    await football_god_backend_actor.updateGameweekStatus(Number(seasonId), Number(updatedGameweek), Number(selectedStatus));
    
    fetchSeason();
    fetchGameweeks();
    setSelectedStatus('');
    setShowGameweekStatusModal(false);
    setIsLoading(false);
  };

  const handleDeleteConfirmed = async () => {
    setIsLoading(true);
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    await football_god_backend_actor.deleteSeason(Number(seasonId));
    setShowDeleteConfirmModal(false);
    setIsLoading(false);
    navigate(`/admin`);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      await fetchSeason();
      await fetchGameweeks();
    };
    fetchData();
  }, []);

  return (
    <Container>
      {isLoading && (
        <div className="customOverlay">
          <Spinner animation="border" />
        </div>
      )}
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card className="mt-4">
            <Card.Header className="text-center">
              <h2>Season: {season.name}</h2>
            </Card.Header>
            <Card.Body>
              <Row className="justify-content-md-center">
                <Col md={12}>
                  <Card className="mt-4">
                    <Card.Header className="text-center">
                      <h2>Gameweeks</h2>
                    </Card.Header>
                    <Card.Body>
                      <div className="table-responsive">
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>Number</th>
                              <th>Status</th>
                              <th>Fixtures</th>
                              <th>Options</th>
                            </tr>
                          </thead>
                          <tbody>
                            {gameweeks.map((gameweek) => (
                              <tr key={gameweek.number}>
                                <td>{gameweek.number}</td>
                                <td>{getGameweekStatus(gameweek.status)}</td>
                                <td>{gameweek.fixtureCount}</td>
                                <td>
                                <Dropdown alignRight className="custom-dropdown">
                                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">Options</Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item href="#" onClick={() => updateStatus(gameweek)}>Update Status</Dropdown.Item>
                                        <LinkContainer to={`/fixtures/${seasonId}/${gameweek.number}`}>
                                            <Dropdown.Item>Fixtures</Dropdown.Item>
                                        </LinkContainer>
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
              <Button variant="primary" className="mb-3" onClick={() => { setShowDeleteConfirmModal(true); }}>
                Delete Season
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showDeleteConfirmModal} onHide={() => { setShowDeleteConfirmModal(false); }}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Season</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this season, related gameweeks and fixtures?</Modal.Body>
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

      <Modal show={showUpdateSeasonModal} onHide={() => { setShowUpdateSeasonModal(false); }}>
        <Modal.Header closeButton>
          <Modal.Title>Update Season</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitUpdateSeason}>
            <Form.Group controlId="seasonName">
              <Form.Label>Home Team</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter season name"
                value={seasonName}
                onChange={(e) => setSeasonName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="seasonYear">
              <Form.Label>Away Team</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter season year"
                value={seasonYear}
                onChange={(e) => setSeasonYear(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowGameweekStatusModal(false); }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submitUpdateGameweekStatus}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showGameweekStatusModal} onHide={() => { setShowGameweekStatusModal(false); }}>
        <Modal.Header closeButton>
          <Modal.Title>Update Gameweek Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p className="mt-3">
                <strong>Season:</strong> {season.name}
            </p>
            <p className="mt-3">
                <strong>Gameweek:</strong> {updatedGameweek}
            </p>
            <Form onSubmit={submitUpdateGameweekStatus}>
                <Form.Group controlId="status">
                    <Form.Label>Status</Form.Label>
                    <Form.Control as="select" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                      <option value="">Select status</option>
                      <option value="0">Unopened</option>
                      <option value="1">Open</option>
                      <option value="2">Closed</option>
                      <option value="3">Finalised</option>
                  </Form.Control>
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowGameweekStatusModal(false); }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submitUpdateGameweekStatus}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default Season;
