import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Dropdown } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../../contexts/AuthContext";
import "../../../assets/main.css";

const SystemState = () => {

  const { authClient } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [seasons, setSeasons] = useState([]);
  const [currentSeason, setCurrentSeason] = useState(null);
  const [currentGameweek, setCurrentGameweek] = useState(null);

  const fetchSeasons = async () => {
    const seasonList = await football_god_backend_actor.getSeasons();
    setSeasons(seasonList);
  };

  const fetchCurrentSeason = async () => {
    const season = await football_god_backend_actor.getCurrentSeason();
    setCurrentSeason(season);
  };

  const fetchCurrentGameweek = async () => {
    const gameweek = await football_god_backend_actor.getCurrentGameweek();
    setCurrentGameweek(gameweek);
  };

  const updateCurrentSeason = async (seasonId) => {
    setIsLoading(true);
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    await football_god_backend_actor.setCurrentSeason(seasonId);
    fetchCurrentSeason();
    setIsLoading(false);
  };

  const updateCurrentGameweek = async (gameweekId) => {
    setIsLoading(true);
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    await football_god_backend_actor.setCurrentGameweek(gameweekId);
    fetchCurrentGameweek();
    setIsLoading(false);
  };

  const updateSystemState = async () => {
    if (currentSeason && currentGameweek) {
      await updateCurrentSeason(currentSeason.id);
      await updateCurrentGameweek(currentGameweek.id);
    }
  };

  useEffect(() => {
    fetchSeasons();
    fetchCurrentSeason();
    fetchCurrentGameweek();
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
              <h2>System State</h2>
            </Card.Header>
            <Card.Body>
              <Dropdown onSelect={(selectedKey) => setCurrentSeason(selectedKey)}>
                <Dropdown.Toggle variant="primary">
                  {currentSeason ? `Current Season: ${currentSeason.name}` : 'Select Season'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {seasons.map((season) => (
                    <Dropdown.Item key={season.id} eventKey={season.id}>
                      {season.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown onSelect={(selectedKey) => setCurrentGameweek(selectedKey)}>
                <Dropdown.Toggle variant="primary" className="ml-3">
                  {currentGameweek ? `Current Gameweek: ${currentGameweek.id}` : 'Select Gameweek'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {Array.from({ length: 38 }, (_, i) => i + 1).map((number) => (
                      <Dropdown.Item key={number} eventKey={number}>
                        {`Gameweek ${number}`}
                      </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Button className="mt-3" variant="primary" onClick={updateSystemState} disabled={!currentSeason || !currentGameweek}>
                Update System State
              </Button>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SystemState;
