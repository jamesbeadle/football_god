import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Table, Form, Modal } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { getGameweekStatus } from '../helpers';

const Admin = () => {
  
  const { authClient } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSeason, setActiveSeason] = useState(null);
  const [activeGameweek, setActiveGameweek] = useState(null);
  const [seasonsData, setSeasonsData] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSetActiveModal, setShowActiveModal] = useState(false);
  
  const createSeason = () => setShowCreateModal(true);

  const fetchActiveSeason = async () => {
    const season = await football_god_backend_actor.getActiveSeasonInfo();
    setActiveSeason(season[0]);
  };

  const fetchActiveGameweek = async () => {
    const gameweek = await football_god_backend_actor.getActiveGameweekInfo();
    setActiveGameweek(gameweek[0]);
  };

  const fetchSeasons = async () => {
    const seasons = await football_god_backend_actor.getSeasonsInfo();
    setSeasonsData(seasons);
  };

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
  
  useEffect(() => {
    const fetchData = async () => {
      await fetchActiveSeason();
      await fetchActiveGameweek();
      await fetchSeasons();
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
              <h2>Admin</h2>
            </Card.Header>
            <Card.Body>
              <p className="mt-3">
                <strong>Active Season:</strong> {activeSeason.name}
              </p>
              <p>
                <strong>Active Gameweek:</strong> {activeGameweek.number}
              </p>
              <p>
                <strong>Gameweek Status:</strong> {getGameweekStatus(activeGameweek.status)}
              </p>
              <Row>
                <LinkContainer to="/teams">
                  <Button variant="primary" className="mb-4 w-100">
                    Set Active State
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

      
      <Modal show={showSetActiveModal} onHide={() => { setSetActiveModal(false); }}>
        <Modal.Header closeButton>
          <Modal.Title>Set Active State</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitCreateSeason}>
            <Form.Group controlId="seasonName">
              <Form.Label>Active Season</Form.Label>
              <Form.Control as="select" value={activeSeason} onChange={(e) => setActiveSeason(e.target.value)}>
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
              <Form.Control as="select" value={activeGameweek} onChange={(e) => setActiveGameweek(e.target.value)}>
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
          <Button variant="primary" onClick={submitCreateSeason}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default Admin;
