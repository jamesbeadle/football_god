import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Spinner, Dropdown  } from 'react-bootstrap';
import "../../../../assets/main.css"; 
import { football_god_backend as football_god_backend_actor } from '../../../../../declarations/football_god_backend';
import CreateTeamModal from './create-team-modal';
import EditTeamModal from './edit-team-modal';
import DeleteTeamModal from './delete-team-modal';

const Teams = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('');
  const [teamsData, setTeamsData] = useState([]);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  const [editedTeam, setEditedTeam] = useState(null);
  const [teamToDelete, setTeamToDelete] = useState(null);
  
  const editTeam = async (team) => {
    setEditedTeam(team);
    setShowEditModal(true);
  };

  const deleteTeam = async (teamId) => {
    setTeamToDelete(teamId);
    setShowDeleteConfirmModal(true);
  };  

  const hideCreateModal = async () => {
    setShowCreateModal(false); 
    fetchTeams();
    setIsLoading(false);
  };

  const hideEditModal = async () => {
    setShowEditModal(false); 
    setEditedTeam(null);
    fetchTeams();
    setIsLoading(false);
  };

  const hideDeleteModal = async () => {
    setShowDeleteConfirmModal(false); 
    setTeamToDelete(null);
    fetchTeams();
    setIsLoading(false);
  };

  const fetchTeams = async () => {
    const teams = await football_god_backend_actor.getTeams();
    setTeamsData(teams);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <Container>
      {isLoading && (
        <div className="customOverlay d-flex flex-column align-items-center justify-content-center">
          <Spinner animation="border" />
          <p className='text-center mt-1'>{loadingText}</p>
        </div>
      )}
      <Row className="justify-content-md-center">
        <Col md={12}>
          <Card className="mt-4">
            <Card.Header className="text-center">
              <h2>Teams</h2>
            </Card.Header>
            <Card.Body>
              <Button variant="primary" className="mb-3" onClick={() => setShowCreateModal(true)}>
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

      <CreateTeamModal
        show={showCreateModal}
        onHide={hideCreateModal}
        setIsLoading={setIsLoading}
      />

      <EditTeamModal
        show={showEditModal}
        onHide={hideEditModal}
        setIsLoading={setIsLoading}
        editedTeam={editedTeam}
      />        
      
      <DeleteTeamModal
        show={showDeleteConfirmModal}
        onHide={hideDeleteModal}
        setIsLoading={setIsLoading}
        teamToDelete={teamToDelete}
      />

    </Container>
  );
};

export default Teams;
