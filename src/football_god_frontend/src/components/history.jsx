import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Dropdown, Table, Button } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

const History = () => {
  const { authClient } = useContext(AuthContext);
  const identity = authClient.getIdentity();
  Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [userHistory, setUserHistory] = useState([]);

  useEffect(() => {
    fetchDisplayName();
    const fetchData = async () => {
      await fetchSeasons();
      await fetchActiveSeason();
    };
    fetchData();
  }, []);

  useEffect(() => {
    fetchUserHistory();
  }, [selectedSeason]);

  const fetchDisplayName = async () => {
    const profile = await football_god_backend_actor.getProfile();
    setDisplayName(profile.displayName);
  };

  const fetchSeasons = async () => {
    const fetchedSeasons = await football_god_backend_actor.getSeasons();
    setSeasons(fetchedSeasons);
  };

  const fetchActiveSeason = async () => {
    const activeSeason = await football_god_backend_actor.getActiveSeason();
    setSelectedSeason(activeSeason[0]);
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

  const handleViewSubmission = (gameweekNumber) => {
    navigate(`/view-submission/${gameweekNumber}`);
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <h2 className="text-center mt-4">Gameweek History</h2>
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
                  <tr key={entry.gameweekNumber}>
                    <td>{entry.gameweekNumber}</td>
                    <td>{entry.enteredSweepstake ? 'Yes' : 'No'}</td>
                    <td>{entry.correctScores} / {entry.predictionCount}</td>
                    <td>{entry.enteredSweepstake ? entry.winnings : 'N/A'}</td>
                    <td>
                  <Button onClick={() => handleViewSubmission(entry.gameweekNumber)} variant="primary">
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
