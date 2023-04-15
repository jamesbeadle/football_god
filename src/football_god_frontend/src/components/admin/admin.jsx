import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import SystemStateModal from './system-state-modal';
import { AuthContext } from "../../contexts/AuthContext";

const Admin = () => {
  const { authClient } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [viewData, setViewData] = useState(null);
  const [showSystemStateModal, setShowSystemStateModal] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      await fetchViewData();
    };
    fetchData();
  }, []);

  const fetchViewData = async () => {
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    const data = await football_god_backend_actor.getAdminDTO();
    setViewData(data);
    setIsLoading(false);
  };

  const hideSystemStateModal = async () => {
    setShowSystemStateModal(false); 
    await fetchViewData();
    setIsLoading(false);
  };

  return (
      isLoading ? (
        <div className="customOverlay d-flex flex-column align-items-center justify-content-center">
          <Spinner animation="border" />
          <p className='text-center mt-1'>Loading Admin</p>
        </div>
      ) : 
      <Container>
        <Row className="justify-content-md-center">
          <Col md={8}>
            <Card className="mt-4 custom-card mb-4">
              <Card.Header className="text-center">
                <h2>Admin</h2>
              </Card.Header>
              <Card.Body>
                <p className="mt-3">
                  <strong>Active Season:</strong> {viewData.activeSeasonName != "" ? viewData.activeSeasonName : 'Not set'}
                </p>
                <p>
                  <strong>Active Gameweek:</strong> {viewData.activeGameweekNumber != 0 ? viewData.activeGameweekNumber : 'Not set'}
                </p>
                <p>
                  <strong>Gameweek Status:</strong> {viewData.activeGameweekStatus}
                </p>
                <Row>
                  <LinkContainer to="/teams">
                    <Button className="mb-4 w-100 custom-button">
                      Manage Teams
                    </Button>
                  </LinkContainer>
                </Row>
                <Row>
                  <LinkContainer to="/seasons">
                    <Button className="mb-4 w-100 custom-button">
                      Manage Seasons
                    </Button>
                  </LinkContainer>
                </Row>
                <Row>
                  <Button onClick={() => { setShowSystemStateModal(true); }} className="mb-4 w-100 custom-button">
                    Set System State
                  </Button>
                </Row>
                <Row>
                  <LinkContainer to="/payout">
                    <Button className="mb-4 w-100 custom-button">
                      Payout Gameweek
                    </Button>
                  </LinkContainer>
                </Row>
                <Row>
                  <LinkContainer to="/balances">
                    <Button className="mb-4 w-100 custom-button">
                      Account Balances
                    </Button>
                  </LinkContainer>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <SystemStateModal
          show={showSystemStateModal}
          onHide={hideSystemStateModal}
          setIsLoading={setIsLoading}
          activeSeason={viewData.activeSeasonId}
          activeGameweek={viewData.activeGameweekNumber}
          seasonsData={viewData.seasons}
        />    
      </Container>
  );
};

export default Admin;
