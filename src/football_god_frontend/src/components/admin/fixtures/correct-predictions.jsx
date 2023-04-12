import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ButtonGroup, Table, Spinner } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import "../../../../assets/main.css";
import { football_god_backend as football_god_backend_actor } from '../../../../../declarations/football_god_backend';
import { useParams } from 'react-router-dom';

const CorrectPredictions = () => {
  const { seasonId, gameweekNumber, fixtureId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('');
  const [teams, setTeamsData] = useState([]);
  const [season, setSeasonData] = useState([]);
  const [fixture, setFixtureData] = useState([]);
  const [predictions, setPredictionsData] = useState(null);
  const [page, setPage] = useState(0);
  const resultsPerPage = 25;

  const fetchTeams = async () => {
    const teamsData = await football_god_backend_actor.getTeams();
    setTeamsData(teamsData);
  };
  
  const fetchSeason = async () => {
    const seasonData = await football_god_backend_actor.getSeason(Number(seasonId));
    setSeasonData(seasonData[0]);
  };

  const fetchFixture = async () => {
    const fixtureData = await football_god_backend_actor.getFixture(Number(seasonId), Number(gameweekNumber), Number(fixtureId));
    setFixtureData(fixtureData[0]);
  };

  const fetchPredictionsData = async () => {
    const predictionsData = await football_god_backend_actor.getCorrectPredictions(Number(seasonId), Number(gameweekNumber), Number(fixtureId), page, resultsPerPage);
    setPredictionsData(predictionsData[0]);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      await fetchTeams();
      await fetchSeason();
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if(teams.length > 0){
        await fetchFixture();
        await fetchPredictionsData();
      }
    };
    fetchData();
  }, [teams]);

  useEffect(() => {
    if(fixture && predictions){
      setIsLoading(false);
    }
  }, [fixture, predictions]);

  const getTeamNameById = (teamId) => {
    const team = teams.find((team) => team.id === teamId);
    return team ? team.name : '';
  };

  const handlePageChange = (change) => {
    setPage((prevPage) => prevPage + change);
  };

  return (
    <Container>
      {isLoading ? (
        <div className="customOverlay d-flex flex-column align-items-center justify-content-center">
          <Spinner animation="border" />
          <p className='text-center mt-1'>{loadingText}</p>
        </div>
      ) : 
      <Row className="justify-content-md-center">
        <Col md={12}>
          <Card className="mt-4">
            <Card.Header className="text-center">
              <h2>Correct Predictions</h2>
            </Card.Header>
            <Card.Body>
                <p className="mt-3">
                    <strong>Season:</strong> {season.name}
                </p>
                <p className="mt-3">
                    <strong>Fixture:</strong> {getTeamNameById(fixture.homeTeamId)} v {getTeamNameById(fixture.awayTeamId)}
                </p>
                <p className="mt-3">
                    <strong>Result:</strong> {fixture.homeGoals} - {fixture.awayGoals}
                </p>
                
                <div className="table-responsive">
                  <Table striped bordered hover>
                      <thead>
                          <tr>
                              <th>Principal Name</th>
                              <th>Display Name</th>
                              <th>Options</th>
                          </tr>
                      </thead>
                      <tbody>
                          {predictions && predictions.entries.map((submission) => (
                          <tr key={submission.principalName}>
                              <td>{submission.principalName}</td>
                              <td>{submission.displayName}</td>
                              <td>
                                  <LinkContainer to={`/view-prediction/${submission.principalName}/${seasonId}/${gameweekNumber}`}>
                                      <Button variant="primary" className="mb-4 w-100">
                                          View
                                      </Button>
                                  </LinkContainer>
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
                      <Button onClick={() => handlePageChange(1)} variant="primary" disabled={(page + 1) * resultsPerPage >= predictions.totalEntries}>
                        Next
                      </Button>
                    </ButtonGroup>
                  </div>
                </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    }

    </Container>
  );
};

export default CorrectPredictions;
