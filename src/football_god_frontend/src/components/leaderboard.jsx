import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Dropdown, Table, Button, ButtonGroup, Spinner } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../declarations/football_god_backend';
import { useNavigate } from 'react-router-dom';

const Leaderboard = () => {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('');

  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedGameweek, setSelectedGameweek] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
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
    const fetchData = async () => {
      if (selectedSeason && selectedSeason.id > 0 && selectedGameweek > 0) {
        await fetchLeaderboard();
        setIsLoading(false);
      }
    };
    fetchData();
    
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
    setSelectedGameweek(activeGameweek[0].number);
  };

  const fetchLeaderboard = async () => {
    if (selectedSeason && selectedGameweek) {
      setIsLoading(true);
      const fetchedLeaderboard = await football_god_backend_actor.getLeaderboard(Number(selectedSeason.id), Number(selectedGameweek), Number(page * resultsPerPage), Number(resultsPerPage));
      setLeaderboard(fetchedLeaderboard);
    }
  };

  const handleViewPrediction = (userId) => {
    navigate(`/view-prediction/${userId}/${selectedSeason.id}/${selectedGameweek}`);
  };

  const handlePageChange = (change) => {
    setPage((prevPage) => prevPage + change);
  };

  const getFormattedPositions = (leaderboard) => {
    const formattedPositions = [];
    let currentPosition = 1;
    let tiedCount = 0;
  
    for (let i = 0; i < leaderboard.entries.length; i++) {
      if (i > 0 && leaderboard.entries[i].correctScores === leaderboard.entries[i - 1].correctScores) {
        tiedCount++;
      } else {
        currentPosition += tiedCount;
        tiedCount = 1;
      }
  
      if (
        (i < leaderboard.entries.length - 1 && leaderboard.entries[i].correctScores === leaderboard.entries[i + 1].correctScores) ||
        (i > 0 && leaderboard.entries[i].correctScores === leaderboard.entries[i - 1].correctScores)
      ) {
        formattedPositions.push(`T${currentPosition + page * resultsPerPage}`);
      } else {
        formattedPositions.push(`${currentPosition + page * resultsPerPage}`);
      }
    }
  
    return formattedPositions;
  };
  

  return (
    <Container>
      {isLoading ? (
        <div className="customOverlay d-flex flex-column align-items-center justify-content-center">
          <Spinner animation="border" />
          <p className='text-center mt-1'>{loadingText}</p>
        </div>
      ) : (
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
              {selectedGameweek ? `Gameweek ${selectedGameweek}` : 'Select Gameweek'}
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
            {leaderboard && (() => {
                const formattedPositions = getFormattedPositions(leaderboard);
                return leaderboard.entries.map((entry, index) => { 
                  
                const classes = formattedPositions[index] === '1' || formattedPositions[index].startsWith('T1') ? 'gold-bg' : '';
                  return (
                  <tr key={entry.principalName} className={classes}>
                    <td>{formattedPositions[index]}</td>
                    <td>{entry.displayName}</td>
                    <td>{entry.correctScores} / {entry.predictionCount}</td>
                    <td>
                      <Button onClick={() => handleViewPrediction(entry.principalName)} variant="primary">
                        View
                      </Button>
                    </td>
                  </tr>
                )});
              })()}
            </tbody>
          </Table>
          <div className="d-flex justify-content-center mt-3">
            <ButtonGroup>
              <Button onClick={() => handlePageChange(-1)} variant="primary" disabled={page === 0}>
                Prior
              </Button>
              <Button onClick={() => handlePageChange(1)} variant="primary" disabled={(page + 1) * resultsPerPage >= leaderboard.totalEntries}>
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
