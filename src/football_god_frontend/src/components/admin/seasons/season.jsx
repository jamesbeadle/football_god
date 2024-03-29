import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Table, Dropdown, Modal, Spinner, Form } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { getGameweekStatus } from '../../helpers';
import { football_god_backend as football_god_backend_actor } from '../../../../../declarations/football_god_backend';
import { AuthContext } from "../../../contexts/AuthContext";
import { Actor } from "@dfinity/agent";

const Season = () => {
  
  const { authClient, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const { seasonId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('');
  const [season, setSeasonData] = useState([]);
  const [gameweeks, setGameweeksData] = useState([]);
  const [showGameweekStatusModal, setShowGameweekStatusModal] = useState(false);
  const [updatedGameweek, setGameweekToUpdate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');

  const fetchSeason = async () => {
    const seasonData = await football_god_backend_actor.getSeason(Number(seasonId));
    setSeasonData(seasonData[0]);
  };

  const fetchGameweeks = async () => {
    const gameweeksData = await football_god_backend_actor.getGameweeks(Number(seasonId));
    setGameweeksData(gameweeksData);
  };

  const updateStatus = async (gameweek) => {
    setGameweekToUpdate(gameweek.number);
    setSelectedStatus(gameweek.status);
    setShowGameweekStatusModal(true);
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
  
  useEffect(() => {
    if(!isAdmin){
      navigate("/");
    }
    const fetchData = async () => {
      await fetchSeason();
      await fetchGameweeks();
      setIsLoading(false);
    };
    fetchData();
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
        <Col md={8}>
          <Card className="mt-4 custom-card mb-4">
            <Card.Header className="text-center">
              <h2>Season: {season.name}</h2>
                      <h2>Gameweeks</h2>
            </Card.Header>
            
            <Card.Body>
              <div className="table-responsive">
                <Table className="custom-table" bordered>
                  <thead>
                    <tr>
                      <th><small>No.</small></th>
                      <th><small>Status</small></th>
                      <th><small>Fixtures</small></th>
                      <th><small>Options</small></th>
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
          <Button variant="secondary" onClick={() => { setShowGameweekStatusModal(false); }}>Cancel</Button>
          <Button className="custom-button" onClick={submitUpdateGameweekStatus}>Save</Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default Season;
