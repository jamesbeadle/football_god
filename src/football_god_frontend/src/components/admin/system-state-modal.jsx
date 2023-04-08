import React, { useState, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../../contexts/AuthContext";

const SystemStateModal = ({ show, onHide, setIsLoading, activeSeason, activeGameweek, seasonsData }) => {

    const { authClient } = useContext(AuthContext);
    const [activeSeasonId, setActiveSeasonId] = useState('');
    const [activeGameweekNumber, setActiveGameweekNumber] = useState('');

    const onShow = async () => {
        if(activeSeason && activeGameweek){
            setActiveSeasonId(activeSeason.id); 
            setActiveGameweekNumber(activeGameweek.number);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const identity = authClient.getIdentity();
        Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
        await football_god_backend_actor.setActiveSeason(Number(activeSeasonId));
        await football_god_backend_actor.setActiveGameweek(Number(activeGameweekNumber));

        onHide();
    };

    const unsetSystemState = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const identity = authClient.getIdentity();
        Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
        await football_god_backend_actor.unsetActiveState();
        onHide();
    };

    return (
        <Modal show={show} onShow={onShow} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Set Active State</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="seasonName">
                    <Form.Label>Active Season</Form.Label>
                    <Form.Control as="select" value={activeSeasonId} onChange={(e) => setActiveSeasonId(e.target.value)}>
                        <option value="">Select Active Season</option>
                        {seasonsData.map((season) => (
                        <option key={season.id} value={season.id}>
                            {season.name}
                        </option>
                        ))}
                    </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="seasonYear">
                    <Form.Label>Active Gameweek</Form.Label>
                    <Form.Control as="select" value={activeGameweekNumber} onChange={(e) => setActiveGameweekNumber(e.target.value)}>
                        <option value="">Select Gameweek</option>
                        {Array.from({ length: 38 }, (_, i) => i + 1).map((number) => (
                        <option key={number} value={number}>
                            {number}
                        </option>
                        ))}
                    </Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={unsetSystemState}>
                    Unset System State
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SystemStateModal;
