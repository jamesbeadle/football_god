import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Dropdown, Table, Button, Spinner } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

const History = () => {
  const { authClient } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [userHistory, setUserHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchSeasons();
      await fetchActiveSeason();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if(!selectedSeason || !seasons){
      return;
    }
    const fetchData = async () => {
      await fetchUserHistory();
    };
    fetchData();
  }, [selectedSeason, seasons]);

  const fetchSeasons = async () => {
    const fetchedSeasons = await football_god_backend_actor.getSeasons();
    setSeasons(fetchedSeasons);
  };

  const fetchActiveSeason = async () => {
    const activeSeason = await football_god_backend_actor.getActiveSeason();
    setSelectedSeason(activeSeason[0]);
  };

  const fetchUserHistory = async () => {
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    const fetchedHistory = await football_god_backend_actor.getUserHistory(selectedSeason.id);
    setUserHistory(fetchedHistory);
    setIsLoading(false);
  };

  const handleSeasonSelect = (season) => {
    setIsLoading(true);
    setSelectedSeason(season);
  };

  const handleViewSubmission = (gameweekNumber) => {
    navigate(`/view-submission/${selectedSeason.id}/${gameweekNumber}`);
  };

  return (
    isLoading ? (
      <div className="customOverlay">
        <Spinner animation="border" />
      </div>
    ) : (
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
                  <th className="text-center">Gameweek</th>
                  <th className="text-center">Sweepstake</th>
                  <th className="text-center">Score</th>
                  <th className="text-center">Winnings (ICP)</th>
                  <th className="text-center">View</th>
                </tr>
              </thead>
              <tbody>
                {userHistory.map((entry) => (
                  <tr key={entry.gameweekNumber}>
                    <td className="text-center">{entry.gameweekNumber}</td>
                    <td className="text-center">{entry.enteredSweepstake ? 'Yes' : 'No'}</td>
                    <td className="text-center">{entry.correctScores} / {entry.predictionCount}</td>
                    <td className="text-center">{entry.enteredSweepstake || Number(entry.winnings) > 0 ? (Number(entry.winnings) / 1e8).toFixed(2) : 'N/A'}</td>
                    <td className="text-center">
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
    )
  );
};

export default History;
