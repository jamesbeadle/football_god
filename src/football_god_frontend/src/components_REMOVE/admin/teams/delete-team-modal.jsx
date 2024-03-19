import React, { useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../../../contexts_REMOVE/AuthContext";

const DeleteTeamModal = ({ show, onHide, setIsLoading, teamToDelete }) => {

  const { authClient } = useContext(AuthContext);
  
  const handleSubmit = async () => {
    setIsLoading(true);

    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    await football_god_backend_actor.deleteTeam(teamToDelete);

    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Team</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this team?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="danger" onClick={handleSubmit}>Delete</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteTeamModal;
