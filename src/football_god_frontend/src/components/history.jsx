import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Dropdown, Table, Button } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../contexts/AuthContext";
import { useHistory } from 'react-router-dom';

const History = () => {
  const { authClient } = useContext(AuthContext);
  const [displayName, setDisplayName] = useState('');
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [userHistory, setUserHistory] = useState([]);
  const history = useHistory();

  const fetchDisplayName = async () => {
    const name = await football_god_backend_actor.getDisplayName();
    setDisplayName(name);
  };

  const fetchSeasons = async () => {
    const fetchedSeasons = await football_god_backend_actor.getSeasons();
    setSeasons(fetchedSeasons);
  };

  const fetchUserHistory = async () => {
    if (selectedSeason) {
      const fetchedHistory = await football_god_backend_actor.getUserHistory(selectedSeason.id);
      setUserHistory(fetchedHistory);
    }
  };

  const handleSeasonSelect = (season) => {
    setSelectedSeason(season);
  };

  useEffect(() => {
    fetchDisplayName();
    fetchSeasons();
  }, []);

  useEffect(() => {
    fetchUserHistory();
  }, [selectedSeason]);

  const handleViewSubmission = (gameweekId) => {
    history.push(`/view-submission/${gameweekId}`);
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <h2 className="text-center mt-4">{displayName}'s History</h2>
          <Dropdown className="mt-3">
            <Dropdown.Toggle variant="primary" id="season-dropdown">
              {selectedSeason ? selectedSeason.name : 'Select Season'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {seasons.map((season) => (
                <Dropdown.Item key={season.id} onClick={() => handleSeasonSelect(season)}>
                  {season.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          {selectedSeason && (
            <Table striped bordered hover responsive className="mt-4">
              <thead>
                <tr>
                  <th>Gameweek</th>
                  <th>Sweepstake</th>
                  <th>Score</th>
                  <th>Winnings (ICP)</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {userHistory.map((entry) => (
                  <tr key={entry.gameweekId}>
                    <td>{entry.gameweekNumber}</td>
                    <td>{entry.enteredSweepstake ? 'Yes' : 'No'}</td>
                    <td>{entry.score}</td>
                    <td>{entry.winnings}</td>
                    <td>
                  <Button onClick={() => handleViewSubmission(entry.gameweekId)} variant="primary">
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Col>
  </Row>
</Container>
);
};

export default History;
