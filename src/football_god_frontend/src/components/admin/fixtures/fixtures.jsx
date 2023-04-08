import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Spinner } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import "../../../../assets/main.css";
import { football_god_backend as football_god_backend_actor } from '../../../../../declarations/football_god_backend';
import { useParams } from 'react-router-dom';
import { getFixtureStatus } from '../../helpers';
import CreateFixtureModal from './create-fixture-modal';

const EditFixtures = () => {
  const { seasonId, gameweekNumber } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [teams, setTeamsData] = useState([]);
  const [season, setSeasonData] = useState([]);
  const [fixturesData, setFixturesData] = useState([]);
  const [showAddFixtureModal, setShowAddFixtureModal] = useState(false);

  const addFixture = () => setShowAddFixtureModal(true);

  const hideAddFixtureModal = async () => {
    setShowAddFixtureModal(false); 
    fetchFixtures();
    setIsLoading(false);
  };

  const fetchTeams = async () => {
    const teamsData = await football_god_backend_actor.getTeams();
    setTeamsData(teamsData);
  };
  
  const fetchSeason = async () => {
    const seasonData = await football_god_backend_actor.getSeason(Number(seasonId));
    setSeasonData(seasonData[0]);
  };

  const fetchFixtures = async () => {
    const fixtures = await football_god_backend_actor.getFixtures(Number(seasonId), Number(gameweekNumber));
    setFixturesData(fixtures);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      await fetchTeams();
      await fetchSeason();
      await fetchFixtures();
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
              <h2>Edit Fixtures</h2>
            </Card.Header>
            <Card.Body>
                <p className="mt-3">
                    <strong>Season:</strong> {season.name}
                </p>
                <p className="mt-3">
                    <strong>Gameweek:</strong> {gameweekNumber}
                </p>
                
                <Button variant="primary" className="mb-3" onClick={addFixture}>
                    New Fixture
                </Button>
                <div className="table-responsive">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                            <th>Home Team</th>
                            <th>Away Team</th>
                            <th>Status</th>
                            <th>Home Goals</th>
                            <th>Away Goals</th>
                            <th>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fixturesData.map((fixture) => (
                            <tr key={fixture.id}>
                                <td>{getTeamNameById(fixture.homeTeamId)}</td>
                                <td>{getTeamNameById(fixture.awayTeamId)}</td>
                                <td>{getFixtureStatus(fixture.status)}</td>
                                <td>{fixture.homeGoals}</td>
                                <td>{fixture.awayGoals}</td>
                                <td>
                                    <LinkContainer to={`/update-fixture/${seasonId}/${gameweekNumber}/${fixture.id}`}>
                                        <Button variant="primary" className="mb-4 w-100">
                                            Edit
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

      <CreateFixtureModal
        show={showAddFixtureModal}
        onHide={hideAddFixtureModal}
        setIsLoading={setIsLoading}
        seasonId={seasonId}
        gameweekNumber={gameweekNumber}
        teams={teams}
      />

    </Container>
  );
};

export default EditFixtures;
