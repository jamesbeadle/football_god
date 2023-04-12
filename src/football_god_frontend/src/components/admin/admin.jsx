import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../../declarations/football_god_backend';
import { getGameweekStatus } from '../helpers';
import SystemStateModal from './system-state-modal';

const Admin = () => {
  
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('');

  const [activeSeason, setActiveSeason] = useState(null);
  const [activeGameweek, setActiveGameweek] = useState(null);
  const [showSystemStateModal, setShowSystemStateModal] = useState(false);
  const [seasonsData, setSeasonsData] = useState([]);

  const hideSystemStateModal = async () => {
    setShowSystemStateModal(false); 
    await fetchActiveSeason();
    await fetchActiveGameweek();
    setIsLoading(false);
  };

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
  };
  
  useEffect(() => {
    const fetchData = async () => {
      await fetchActiveSeason();
      await fetchActiveGameweek();
      await fetchSeasons();
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
                <LinkContainer to="/teams">
                  <Button variant="primary" className="mb-4 w-100">
                    Manage Teams
                  </Button>
                </LinkContainer>
              </Row>
              <Row>
                <LinkContainer to="/seasons">
                  <Button variant="primary" className="mb-4 w-100">
                    Manage Seasons
                  </Button>
                </LinkContainer>
              </Row>
              <Row>
                <Button variant="primary" onClick={() => { setShowSystemStateModal(true); }} className="mb-4 w-100">
                  Set System State
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
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <SystemStateModal
        show={showSystemStateModal}
        onHide={hideSystemStateModal}
        setIsLoading={setIsLoading}
        activeSeason={activeSeason}
        activeGameweek={activeGameweek}
        seasonsData={seasonsData}
      />      

    </Container>
  );
};

export default Admin;
