import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Dropdown, Table, Button, ButtonGroup } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../declarations/football_god_backend';
import { useNavigate } from 'react-router-dom';

const Leaderboard = () => {

  const navigate = useNavigate();
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedGameweek, setSelectedGameweek] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [page, setPage] = useState(0);
  const resultsPerPage = 25;

  useEffect(() => {
    fetchSeasons();
  }, []);

  useEffect(() => {
    if(seasons && Object.keys(seasons).length > 0){
      const fetchData = async () => {
        await fetchActiveSeason();
        await fetchActiveGameweek();
      };
      fetchData();
    }
  }, [seasons]);

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedSeason, selectedGameweek, page]);

  const fetchSeasons = async () => {
    const fetchedSeasons = await football_god_backend_actor.getSeasons();
    setSeasons(fetchedSeasons);
  };

  const fetchActiveSeason = async () => {
    const activeSeason = await football_god_backend_actor.getActiveSeason();
    setSelectedSeason(activeSeason[0]);
  };

  const fetchActiveGameweek = async () => {
    const activeGameweek = await football_god_backend_actor.getActiveGameweek();
    setSelectedGameweek(activeGameweek[0]);
  };

  const fetchLeaderboard = async () => {
    if (selectedSeason && selectedGameweek) {
      const fetchedLeaderboard = await football_god_backend_actor.getLeaderboard(selectedSeason.id, selectedGameweek.number, page * resultsPerPage, resultsPerPage);
      setLeaderboard(fetchedLeaderboard);
    }
  };

  const handleViewSubmission = (userId) => {
    navigate(`/view-submission/${userId}`);
  };

  const handlePageChange = (change) => {
    setPage((prevPage) => prevPage + change);
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <h2 className="text-center mt-4">Leaderboard</h2>
          <Dropdown className="mt-3">
            <Dropdown.Toggle variant="primary" id="season-dropdown">
              {selectedSeason ? selectedSeason.name : 'Select Season'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {seasons.map((season) => (
                <Dropdown.Item key={season.id} onClick={() => setSelectedSeason(season)}>
                  {season.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown className="mt-3">
            <Dropdown.Toggle variant="primary" id="gameweek-dropdown">
              {selectedGameweek ? `Gameweek ${selectedGameweek.number}` : 'Select Gameweek'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {gameweeks.map((gameweek) => (
                <Dropdown.Item key={gameweek.id} onClick={() => setSelectedGameweek(gameweek)}>
                  Gameweek {gameweek.number}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
            </Dropdown>
      {leaderboard.length > 0 && (
        <Table striped bordered hover responsive className="mt-3">
          <thead>
            <tr>
              <th>Position</th>
              <th>Name</th>
              <th>Score</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={entry.userId}>
                <td>{index + 1 + page * resultsPerPage}</td>
                <td>{entry.displayName}</td>
                <td>{entry.score}</td>
                <td>
                  <Button onClick={() => handleViewSubmission(entry.userId)} variant="primary">
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <div className="d-flex justify-content-center mt-3">
        <ButtonGroup>
          <Button onClick={() => handlePageChange(-1)} variant="primary" disabled={page === 0}>
            Prior
          </Button>
          <Button onClick={() => handlePageChange(1)} variant="primary">
            Next
          </Button>
        </ButtonGroup>
      </div>
    </Col>
  </Row>
</Container>
);
};
export default Leaderboard;
