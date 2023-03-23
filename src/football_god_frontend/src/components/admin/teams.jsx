import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Spinner, Dropdown  } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../../contexts/AuthContext";
import "../../../assets/main.css"; 

const Teams = () => {
  const { authClient } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamsData, setTeamsData] = useState([]);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  const [editedTeam, setEditedTeam] = useState(null);
  const [teamToDelete, setTeamToDelete] = useState(null);
  
  const createTeam = () => setShowCreateModal(true);

  const editTeam = async (team) => {
    setEditedTeam(team);
    setTeamName(team.name);
    setShowEditModal(true);
  };

  const deleteTeam = async (teamId) => {
    setTeamToDelete(teamId);
    setShowDeleteConfirmModal(true);
  };  
  
  const handleSubmitTeam = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    
    if (editedTeam) {
      await football_god_backend_actor.updateTeam(editedTeam.id, teamName);
    } else {
      await football_god_backend_actor.createTeam(teamName);
    }
    
    fetchTeams();
    setTeamName('');
    setEditedTeam(null);
    setShowCreateModal(false);
    setShowEditModal(false);
    setIsLoading(false);
  };

  const handleDeleteConfirmed = async () => {
    setIsLoading(true);
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    await football_god_backend_actor.deleteTeam(teamToDelete);
    fetchTeams();
    setShowDeleteConfirmModal(false);
    setIsLoading(false);
  };

  const fetchTeams = async () => {
    const teams = await football_god_backend_actor.getTeams();
    setTeamsData(teams);
  };

  useEffect(() => {
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
              <h2>Teams</h2>
            </Card.Header>
            <Card.Body>
              <Button variant="primary" className="mb-3" onClick={createTeam}>
                Create New Team
              </Button>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Options</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamsData.map((team) => (
                      <tr key={team.id}>
                        <td>{team.id}</td>
                        <td>{team.name}</td>
                        <td>
                          <Dropdown alignRight className="custom-dropdown">
                            <Dropdown.Toggle variant="secondary" id="dropdown-basic">Options</Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item href="#" onClick={() => editTeam(team)}>Edit</Dropdown.Item>
                              <Dropdown.Item href="#" onClick={() => deleteTeam(team.id)}>Delete</Dropdown.Item>
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
          <Modal.Title>Create New Team</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={handleSubmitTeam}>
          <Form.Group controlId="teamName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter team name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </Form.Group>

        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowCreateModal(false); }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitTeam}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => { setEditedTeam(null); setShowEditModal(false); }}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Team</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitTeam}>
            <Form.Group controlId="teamName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter team name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setEditedTeam(null); setShowEditModal(false); }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitTeam}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>         

      <Modal show={showDeleteConfirmModal} onHide={() => { setShowDeleteConfirmModal(false); }}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Team</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this team?</Modal.Body>
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

export default Teams;
