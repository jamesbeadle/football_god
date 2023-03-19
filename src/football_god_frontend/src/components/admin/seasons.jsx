import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form } from 'react-bootstrap';
import { Actor, HttpAgent } from '@dfinity/agent';
import { football_god_backend as football_god_backend_actor } from '../../../../declarations/football_god_backend';

const Seasons = () => {
  
  const agent = new HttpAgent({ principal });
  const football_god_backend = Actor.createActor(football_god_backend_idl, { agent, canisterId: football_god_backend_actor });

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const [seasonName, setSeasonName] = useState('');
  const [seasonYear, setSeasonYear] = useState('');
  const [seasonsData, setSeasonsData] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const parsedYear = parseInt(seasonYear, 10);
    await football_god_backend.createSeason(seasonName, parsedYear);
    fetchSeasons();
    setSeasonName('');
    setSeasonYear('');
    handleClose();
  };

  const fetchSeasons = async () => {
    const seasons = await football_god_backend.getSeasons();
    setSeasonsData(seasons);
    console.log(seasons);
  };

  useEffect(() => {
    fetchSeasons();
  }, []);

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={12}>
          <Card className="mt-4">
            <Card.Header className="text-center">
              <h2>Seasons</h2>
            </Card.Header>
            <Card.Body>
              <Button variant="primary" className="mb-3" onClick={handleShow}>
                Create New Season
              </Button>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Year</th>
                    <th>Status</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {seasonsData.map((season) => (
                    <tr key={season.id}>
                      <td>{season.id}</td>
                      <td>{season.name}</td>
                      <td>{season.year}</td>
                      <td>{season.status}</td>
                      <td>
                        <Button variant="warning">Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Season</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={handleSubmit}>
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
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Seasons;
