import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Dropdown, Table, Button, ButtonGroup, Spinner } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../declarations/football_god_backend';
import { useNavigate } from 'react-router-dom';

const Leaderboard = () => {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [viewData, setViewData] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(0);
  const [selectedGameweek, setSelectedGameweek] = useState(0);
  const [page, setPage] = useState(0);
  const count = 25;

  useEffect(() => {
    const fetchData = async () => {
      await fetchViewData();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedSeason == 0 && selectedGameweek == 0) {
      return;
    }

    setIsLoading(true);
    
    const fetchData = async () => {
        await fetchViewData();
        setIsLoading(false);
    };
    fetchData();
    
  }, [selectedSeason, selectedGameweek, page]);

  const fetchViewData = async () => {
    const data = await football_god_backend_actor.getLeaderboardDTO(Number(selectedSeason), Number(selectedGameweek), Number(page), Number(count));
    setViewData(data);
    setIsLoading(false);
  };

  const handleViewPrediction = (userId) => {
    var seasonId = Number(selectedSeason);
    var gameweekNumber = Number(selectedGameweek);

    if (selectedSeason == 0 ) {
      seasonId = viewData.activeSeasonId;
    }
    if (selectedGameweek == 0) {
      gameweekNumber = viewData.activeGameweekNumber;
    }
    navigate(`/view-prediction/${userId}/${seasonId}/${gameweekNumber}`);
  };

  const handlePageChange = (change) => {
    setPage((prevPage) => prevPage + change);
  };

  return (
    <Container>
      {isLoading ? (
        <div className="customOverlay d-flex flex-column align-items-center justify-content-center">
          <Spinner animation="border" />
          <p className='text-center mt-1'>Loading Leaderboard</p>
        </div>
      ) : (
      <Row className="justify-content-md-center">
        <Col md={8}>
          <h2 className="text-center mt-4">Leaderboard</h2>
          <Dropdown className="mt-3">
            <Dropdown.Toggle variant="primary" id="season-dropdown">
              {viewData.activeSeasonName}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {viewData.seasons.map((season) => (
                <Dropdown.Item key={season.seasonId} onClick={() => setSelectedSeason(season.seasonId)}>
                  {season.seasonName}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown className="mt-3">
            <Dropdown.Toggle variant="primary" id="gameweek-dropdown">
              {`Gameweek ${viewData.activeGameweekNumber}`}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {Array.from({ length: 38 }, (_, i) => i + 1).map((number) => (
                <Dropdown.Item key={number} onClick={() => setSelectedGameweek(number)}>
                  Gameweek {number}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <p className='mt-3'><small>You can update your display name in on your profile page.</small></p>
          <Table striped bordered hover responsive className="mt-1">
            <thead>
              <tr>
                <th>Position</th>
                <th>Name</th>
                <th>Score</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {viewData.leaderboardEntries.map((entry, index) => (
                <tr key={entry.principalName}>
                  <td>{index + 1 + page * count}</td>
                  <td>{entry.displayName}</td>
                  <td>{entry.correctScores} / {entry.totalFixtures}</td>
                  <td>
                    <Button onClick={() => handleViewPrediction(entry.principalName)} variant="primary">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-center mt-3">
            <ButtonGroup>
              <Button onClick={() => handlePageChange(-1)} variant="primary" disabled={page === 0}>
                Prior
              </Button>
              <Button onClick={() => handlePageChange(1)} variant="primary" disabled={(page + 1) * count >= viewData.totalEntries}>
                Next
              </Button>
            </ButtonGroup>
          </div>
        </Col>
      </Row>
      )}
    </Container>
  );
};
export default Leaderboard;
