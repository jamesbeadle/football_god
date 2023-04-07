import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Spinner, Dropdown  } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../../../declarations/football_god_backend';
import "../../../../assets/main.css"; 

const Seasons = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [seasonsData, setSeasonsData] = useState([]);
  const [seasonName, setSeasonName] = useState('');
  const [seasonYear, setSeasonYear] = useState('');
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const fetchSeasons = async () => {
    const seasons = await football_god_backend_actor.getSeasons();
    setSeasonsData(seasons);
    setIsLoading(false);
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

  useEffect(() => {
    fetchSeasons();
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
    </Container>
  );
};

export default Seasons;
