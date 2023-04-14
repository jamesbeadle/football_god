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
  const [viewData, setViewData] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(0);
  
  useEffect(() => {
    const fetchData = async () => {
      await fetchViewData();
    };
    fetchData();
  }, []);

  const fetchViewData = async () => {
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    const data = await football_god_backend_actor.getHistoryDTO(Number(selectedSeason));
    setViewData(data);
    setSelectedSeason(data.activeSeasonId);
    setIsLoading(false);
  };

  const handleSeasonSelect = async (season) => {
    setIsLoading(true);
    setSelectedSeason(season);
    await fetchViewData();
  };

  const handleViewSubmission = (gameweekNumber) => {
    navigate(`/view-prediction/${viewData.userId}/${Number(selectedSeason)}/${gameweekNumber}`);
  };

  return (
    isLoading ? (
      <div className="customOverlay d-flex flex-column align-items-center justify-content-center">
        <Spinner animation="border" />
        <p className='text-center mt-1'>Loading History</p>
      </div>
    ) : (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <h2 className="text-center mt-4">Gameweek History</h2>
          <Dropdown className="mt-3">
            <Dropdown.Toggle variant="primary" id="season-dropdown">
              {viewData.activeSeasonName}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {viewData.seasons.map((season) => (
                <Dropdown.Item key={season.seasonId} onClick={() => handleSeasonSelect(season)}>
                  {season.seasonName}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
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
                {viewData.seasonGameweeks.map((entry) => (
                  <tr key={entry.gameweekNumber}>
                    <td className="text-center">{entry.gameweekNumber}</td>
                    <td className="text-center">{entry.enteredSweepstake ? 'Yes' : 'No'}</td>
                    <td className="text-center">{entry.correctScores} / {entry.totalFixtures}</td>
                    <td className="text-center">{entry.enteredSweepstake || Number(entry.winnings) > 0 ? (Number(entry.winnings) / 1e8).toFixed(2) : 'N/A'}</td>
                    <td className="text-center">
                      <Button className="custom-button" onClick={() => handleViewSubmission(entry.gameweekNumber)} variant="primary">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
        </Col>
      </Row>
    </Container>
    )
  );
};

export default History;
