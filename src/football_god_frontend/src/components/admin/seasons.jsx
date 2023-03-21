import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Spinner, Dropdown  } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../../contexts/AuthContext";
import "../../../assets/main.css"; 

const Seasons = () => {
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);


  const [isLoading, setIsLoading] = useState(false);
  const [editedSeason, setEditedSeason] = useState(null);
  const [seasonToDelete, setSeasonToDelete] = useState(null);
  
  const handleShowCreate = () => setShowCreateModal(true);

  const editSeason = async (season) => {
    setEditedSeason(season);
    setSeasonName(season.name);
    setSeasonYear(season.year);
    setShowEditModal(true);
  };

  const deleteSeason = async (seasonId) => {
    setSeasonToDelete(seasonId);
    setShowDeleteConfirmModal(true);
  };
  

  const [seasonName, setSeasonName] = useState('');
  const [seasonYear, setSeasonYear] = useState('');
  const [seasonsData, setSeasonsData] = useState([]);

  const { authClient } = useContext(AuthContext);

  const handleDeleteConfirmed = async () => {
    setIsLoading(true);
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    await football_god_backend_actor.deleteSeason(seasonToDelete);
    fetchSeasons();
    setIsLoading(false);
    setShowDeleteConfirmModal(false);
  };

  const handleSubmitSeason = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    
    const parsedYear = parseInt(seasonYear, 10);

    if (editedSeason) {
      await football_god_backend_actor.updateSeason(editedSeason.id, seasonName, parsedYear);
    } else {
      await football_god_backend_actor.createSeason(seasonName, parsedYear);
    }
    
    fetchSeasons();
    setSeasonName('');
    setSeasonYear('');
    setEditedSeason(null);
    setShowCreateModal(false);
    setShowEditModal(false);
    setIsLoading(false);
  };

  const fetchSeasons = async () => {
    const seasons = await football_god_backend_actor.getSeasons();
    setSeasonsData(seasons);
    console.log(seasons);
  };

  useEffect(() => {
    fetchSeasons();
  }, []);

  return (
    <Container>
      {isLoading && (
        <div className="seasonOverlay">
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
              <Button variant="primary" className="mb-3" onClick={handleShowCreate}>
                Create New Season
              </Button>
              <div className="table-responsive">
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
                        <Dropdown alignRight className="season-dropdown">
                          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                            Options
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item href="#" onClick={() => editSeason(season)}>Edit</Dropdown.Item>
                            <Dropdown.Item href="#" onClick={() => deleteSeason(season.id)}>
                              Delete
                            </Dropdown.Item>
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

      <Modal show={showCreateModal} onHide={() => { setShowCreateModal(false); }}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Season</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={handleSubmitSeason}>
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
          <Button variant="primary" onClick={handleSubmitSeason}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => { setEditedSeason(null); setShowEditModal(false); }}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Season</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitSeason}>
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
          <Button variant="secondary" onClick={() => { setEditedSeason(null); setShowEditModal(false); }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitSeason}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>         

      <Modal show={showDeleteConfirmModal} onHide={() => { setShowDeleteConfirmModal(false); }}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Season</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this season?</Modal.Body>
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

export default Seasons;
