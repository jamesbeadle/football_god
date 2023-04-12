import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Spinner } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import "../../../../assets/main.css";
import { football_god_backend as football_god_backend_actor } from '../../../../../declarations/football_god_backend';
import { useParams } from 'react-router-dom';

const CorrectPredictions = () => {
  const { seasonId, gameweekNumber, fixtureId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [teams, setTeamsData] = useState([]);
  const [season, setSeasonData] = useState([]);
  const [fixture, setFixtureData] = useState([]);
  const [predictions, setPredictionsData] = useState([]);

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
    setFixtureData(fixtureData);
  };

  const fetchPredictionsData = async () => {
    const predictionsData = await football_god_backend_actor.getCorrectPredictions(Number(seasonId), Number(gameweekNumber), Number(fixtureId));
    setPredictionsData(predictionsData);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      await fetchTeams();
      await fetchSeason();
      await fetchFixture();
      await fetchPredictionsData();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const getTeamNameById = (teamId) => {
    const team = teams.find((team) => team.id === teamId);
    return team ? team.name : '';
  };

  return (
    <Container>
      {isLoading && (
        <div className="customOverlay">
          <Spinner animation="border" />
        </div>
      )}
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
                            {predictions.map((submission) => (
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
                </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </Container>
  );
};

export default CorrectPredictions;
