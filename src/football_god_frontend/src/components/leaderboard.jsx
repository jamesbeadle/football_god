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
    console.log(page);
    
    setIsLoading(true);
    
    const fetchData = async () => {
        await fetchViewData();
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
    navigate(`/view-prediction/${userId}/${Number(seasonId)}/${Number(gameweekNumber)}`);
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
            <Dropdown.Toggle id="season-dropdown" className="custom-button">
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
            <Dropdown.Toggle id="gameweek-dropdown"  className="custom-button">
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
          {viewData.status > 1 && (
            <p className="mt-3">
              <strong>Total Pot:</strong> {(Number(viewData.totalPot) / 1e8).toFixed(0)} ICP
            </p>
          )}
          {viewData.status == 3 && (
            <p className="mt-3">
              <strong>Winners Share:</strong> {(Number(viewData.winningShare) / 1e8).toFixed(2)} ICP
            </p>
          )}
          <p className='mt-3'><small>You can update your display name in on your profile page.</small></p>
          <Table bordered responsive className="mt-1 custom-table">
            <thead>
              <tr>
                <th><small>Pos</small></th>
                <th><small>Name</small></th>
                <th><small>Score</small></th>
                <th><small>View</small></th>
              </tr>
            </thead>
            <tbody>
              {viewData.leaderboardEntries.map((entry) => (
                <tr key={entry.principalName}>
                  <td>
                    {entry.position}
                  </td>
                  <td>{entry.principalName == entry.displayName ? "Unknown" : entry.displayName}</td>
                  <td>{entry.correctScores} / {entry.totalFixtures}</td>
                  <td>
                    <Button className="custom-button" onClick={() => handleViewPrediction(entry.principalName)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-center mt-3 mb-3">
            <ButtonGroup>
              <Button className="custom-button" onClick={() => handlePageChange(-1)} disabled={page === 0}>
                Prior
              </Button>
              <div className="d-flex align-items-center mr-3 ml-3">
                <p className="mb-0">Page {page + 1}</p>
              </div>
              <Button className="custom-button" onClick={() => handlePageChange(1)} disabled={(page + 1) * count >= viewData.totalEntries}>
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
