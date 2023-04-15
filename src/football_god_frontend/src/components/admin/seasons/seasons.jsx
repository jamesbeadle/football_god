import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Spinner, Dropdown  } from 'react-bootstrap';
import { Link } from "react-router-dom";
import "../../../../assets/main.css"; 
import { football_god_backend as football_god_backend_actor } from '../../../../../declarations/football_god_backend';
import CreateSeasonModal from './create-season-modal';
import EditSeasonModal from './edit-season-modal';
import DeleteSeasonModal from './delete-season-modal';

const Seasons = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('');
  const [seasonsData, setSeasonsData] = useState([]);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  const [editedSeason, setEditedSeason] = useState(null);
  const [seasonToDelete, setSeasonToDelete] = useState(null);
  
  const editSeason = async (season) => {
    setEditedSeason(season);
    setShowEditModal(true);
  };

  const deleteSeason = async (seasonId) => {
    setSeasonToDelete(seasonId);
    setShowDeleteConfirmModal(true);
  };  

  const hideCreateModal = async () => {
    setShowCreateModal(false); 
    fetchSeasons();
    setIsLoading(false);
  };

  const hideEditModal = async () => {
    setShowEditModal(false); 
    setEditedSeason(null);
    fetchSeasons();
    setIsLoading(false);
  };

  const hideDeleteModal = async () => {
    setShowDeleteConfirmModal(false); 
    setSeasonToDelete(null);
    fetchSeasons();
    setIsLoading(false);
  };

  const fetchSeasons = async () => {
    const seasons = await football_god_backend_actor.getSeasons();
    setSeasonsData(seasons);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSeasons();
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
          <Card className="mt-4 custom-card mb-4">
            <Card.Header className="text-center">
              <h2>Seasons</h2>
            </Card.Header>
            <Card.Body>
              <Button className="mb-3 custom-button" onClick={() => setShowCreateModal(true)}>
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
                        <Dropdown alignRight className="custom-dropdown">
                            <Dropdown.Toggle variant="secondary" id="dropdown-basic">Options</Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} to={`/season/${season.id}`}>View</Dropdown.Item>
                                <Dropdown.Item href="#" onClick={() => editSeason(season)}>Edit</Dropdown.Item>
                                <Dropdown.Item href="#" onClick={() => deleteSeason(season.id)}>Delete</Dropdown.Item>
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

      <CreateSeasonModal
        show={showCreateModal}
        onHide={hideCreateModal}
        setIsLoading={setIsLoading}
      />

      <EditSeasonModal
        show={showEditModal}
        onHide={hideEditModal}
        setIsLoading={setIsLoading}
        editedSeason={editedSeason}
      />        
      
      <DeleteSeasonModal
        show={showDeleteConfirmModal}
        onHide={hideDeleteModal}
        setIsLoading={setIsLoading}
        seasonToDelete={seasonToDelete}
      />

    </Container>
  );
};

export default Seasons;
