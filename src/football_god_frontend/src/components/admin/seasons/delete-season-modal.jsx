import React, { useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../../../contexts/AuthContext";

const DeleteSeasonModal = ({ show, onHide, setIsLoading, seasonToDelete }) => {

  const { authClient } = useContext(AuthContext);
  
  const handleSubmit = async () => {
    setIsLoading(true);

    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    await football_god_backend_actor.deleteSeason(seasonToDelete);

    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
            <Modal.Title>Delete Season</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this season, related gameweeks and fixtures?</Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>Cancel</Button>
            <Button variant="danger" onClick={handleSubmit}>Delete</Button>
        </Modal.Footer>
    </Modal>
  );
};

export default DeleteSeasonModal;
