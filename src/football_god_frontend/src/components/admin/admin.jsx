import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Table, Form, Modal } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { getGameweekStatus } from '../helpers';
import { AuthContext } from "../../contexts/AuthContext";
import { football_god_backend as football_god_backend_actor } from '../../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";

const Admin = () => {
  
  const { authClient } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [seasonsData, setSeasonsData] = useState([]);

  const [activeSeason, setActiveSeason] = useState(null);
  const [activeGameweek, setActiveGameweek] = useState(null);
  const [activeSeasonId, setActiveSeasonId] = useState(null);
  const [activeGameweekNumber, setActiveGameweekNumber] = useState(null);
  const [seasonName, setSeasonName] = useState('');
  const [seasonYear, setSeasonYear] = useState('');
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSetActiveModal, setShowActiveModal] = useState(false);
  
  const fetchSeasons = async () => {
    const seasons = await football_god_backend_actor.getSeasons();
    setSeasonsData(seasons);
  };
  
  const fetchActiveSeason = async () => {
    const season = await football_god_backend_actor.getActiveSeason();
    setActiveSeason(season[0]);
  };

  const fetchActiveGameweek = async () => {
    const gameweek = await football_god_backend_actor.getActiveGameweek();
    setActiveGameweek(gameweek[0]);
    console.log(gameweek)
  };
  
  const createSeason = () => setShowCreateModal(true);

  const submitCreateSeason = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    
    const parsedYear = parseInt(seasonYear, 10);
    await football_god_backend_actor.createSeason(seasonName, parsedYear);
    
    fetchSeasons();
    setSeasonName('');
    setSeasonYear('');
    setShowCreateModal(false);
    setIsLoading(false);
  };

  const submitSetActiveState = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    
    console.log(activeGameweekNumber)
    await football_god_backend_actor.setActiveSeason(Number(activeSeasonId));
    await football_god_backend_actor.setActiveGameweek(Number(activeGameweekNumber));
    await fetchActiveSeason();
    await fetchActiveGameweek();
    
    setActiveSeasonId('');
    setActiveGameweekNumber('');
    setShowActiveModal(false);
    setIsLoading(false);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      await fetchActiveSeason();
      await fetchActiveGameweek();
      await fetchSeasons();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (activeSeason && Object.keys(activeSeason).length > 0
        && activeGameweek && Object.keys(activeGameweek).length > 0) {
      setActiveSeasonId(activeSeason.id);
      setActiveGameweekNumber(activeGameweek.number);
    }
  }, [activeSeason, activeGameweek]);

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
              <h2>Admin</h2>
            </Card.Header>
            <Card.Body>
              <p className="mt-3">
                <strong>Active Season:</strong> {activeSeason ? activeSeason.name : 'Not set'}
              </p>
              <p>
                <strong>Active Gameweek:</strong> {activeGameweek ? activeGameweek.number : 'Not set'}
              </p>
              <p>
                <strong>Gameweek Status:</strong> {activeGameweek ? getGameweekStatus(activeGameweek.status) : 'Not set'}
              </p>
              <Row>
                <Button variant="primary" onClick={() => { setShowActiveModal(true); }} className="mb-4 w-100">
                  Set Active State
                </Button>
              </Row>
              <Row>
                <LinkContainer to="/payout">
                  <Button variant="primary" className="mb-4 w-100">
                    Payout Gameweek
                  </Button>
                </LinkContainer>
              </Row>
              <Row>
                <LinkContainer to="/balances">
                  <Button variant="primary" className="mb-4 w-100">
                    Account Balances
                  </Button>
                </LinkContainer>
              </Row>
              <Row>
                <LinkContainer to="/teams">
                  <Button variant="primary" className="mb-4 w-100">
                    Manage Teams
                  </Button>
                </LinkContainer>
              </Row>
              <Row className="justify-content-md-center">
                <Col md={12}>
                  <Card className="mt-4">
                    <Card.Header className="text-center">
                      <h2>Seasons</h2>
                    </Card.Header>
                    <Card.Body>
                      <Button variant="primary" className="mb-3" onClick={createSeason}>
                        Create New Season
                      </Button>
                      <div className="table-responsive">
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Name</th>
                              <th>Year</th>
                              <th>Options</th>
                            </tr>
                          </thead>
                          <tbody>
                            {seasonsData.map((season) => (
                              <tr key={season.id}>
                                <td>{season.id}</td>
                                <td>{season.name}</td>
                                <td>{season.year}</td>
                                <td>
                                  <LinkContainer to={`/season/${season.id}`}>
                                    <Button variant="primary" className="mb-4 w-100">
                                      View
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
            </Card.Body>
          </Card>
        </Col>
      </Row>


      <Modal show={showCreateModal} onHide={() => { setShowCreateModal(false); }}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Season</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitCreateSeason}>
            <Form.Group controlId="seasonName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter season name"
                value={seasonName}
                onChange={(e) => setSeasonName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="seasonYear">
              <Form.Label>Year</Form.Label>
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
          <Button variant="secondary" onClick={() => { setShowCreateModal(false); }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submitCreateSeason}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      
      <Modal show={showSetActiveModal} onHide={() => { setShowActiveModal(false); }}>
        <Modal.Header closeButton>
          <Modal.Title>Set Active State</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitSetActiveState}>
            <Form.Group controlId="seasonName">
              <Form.Label>Active Season</Form.Label>
              <Form.Control as="select" value={activeSeasonId} onChange={(e) => setActiveSeasonId(e.target.value)}>
                <option value="">Select Active Season</option>
                {seasonsData.map((season) => (
                  <option key={season.id} value={season.id}>
                    {season.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="seasonYear">
              <Form.Label>Active Gameweek</Form.Label>
              <Form.Control as="select" value={activeGameweekNumber} onChange={(e) => setActiveGameweekNumber(e.target.value)}>
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
          <Button variant="secondary" onClick={() => { setShowActiveModal(false); }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submitSetActiveState}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default Admin;
