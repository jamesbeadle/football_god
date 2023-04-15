import React, { useState, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../../../contexts/AuthContext";

const CreateFixtureModal = ({ show, onHide, setIsLoading, seasonId, gameweekNumber, teams }) => {
  
  const { authClient } = useContext(AuthContext);
  
  const [homeTeamId, setHomeTeamId] = useState('');
  const [awayTeamId, setAwayTeamId] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    await football_god_backend_actor.addFixtureToGameweek(Number(seasonId), Number(gameweekNumber), Number(homeTeamId), Number(awayTeamId));
    
    hideModal();
  };

  const hideModal = () => {
    setHomeTeamId('');
    setAwayTeamId('');
    onHide();
  };

  return (
    <Modal show={show} onHide={hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Fixture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="homeTeamId">
            <Form.Label>Home Team</Form.Label>
            <Form.Control as="select" value={homeTeamId} onChange={(e) => setHomeTeamId(e.target.value)}>
              <option value="">Select Home Team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="awayTeamId">
            <Form.Label>Away Team</Form.Label>
            <Form.Control as="select" value={awayTeamId} onChange={(e) => setAwayTeamId(e.target.value)}>
              <option value="">Select Away Team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>Cancel</Button>
            <Button className="custom-button" onClick={handleSubmit}>Save</Button>
        </Modal.Footer>
    </Modal>
  );
};

export default CreateFixtureModal;
