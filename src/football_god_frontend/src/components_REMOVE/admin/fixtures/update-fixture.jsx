import { Actor } from "@dfinity/agent";
import { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { football_god_backend as football_god_backend_actor } from "../../../../../declarations/football_god_backend";
import "../../../../assets/main.css";
import { AuthContext } from "../../../contexts_REMOVE/AuthContext";

const UpdateFixture = () => {
  const { seasonId, gameweekNumber, fixtureId } = useParams();
  const navigate = useNavigate();

  const { authClient, isAdmin } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [teams, setTeamsData] = useState([]);
  const [fixture, setFixtureData] = useState([]);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const [fixtureStatus, setFixtureStatus] = useState(null);
  const [homeGoals, setHomeGoals] = useState(0);
  const [awayGoals, setAwayGoals] = useState(0);

  const handleSubmitFixture = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);

    await football_god_backend_actor.updateFixture(
      Number(seasonId),
      Number(gameweekNumber),
      Number(fixtureId),
      Number(homeTeam),
      Number(awayTeam),
      Number(fixtureStatus),
      Number(homeGoals),
      Number(awayGoals)
    );

    navigate(`/fixtures/${seasonId}/${gameweekNumber}`);
    setIsLoading(false);
  };

  const handleDeleteConfirmed = async () => {
    setIsLoading(true);
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    await football_god_backend_actor.deleteFixture(
      Number(seasonId),
      Number(gameweekNumber),
      Number(fixtureId)
    );
    setShowDeleteConfirmModal(false);
    setIsLoading(false);
    navigate(`/fixtures/${seasonId}/${gameweekNumber}`);
  };

  const fetchFixture = async () => {
    const fixtureData = await football_god_backend_actor.getFixture(
      Number(seasonId),
      Number(gameweekNumber),
      Number(fixtureId)
    );
    setFixtureData(fixtureData[0]);
  };

  const fetchTeams = async () => {
    const teamsData = await football_god_backend_actor.getTeams();
    setTeamsData(teamsData);
  };

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
    const fetchData = async () => {
      await fetchFixture();
      await fetchTeams();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (fixture && Object.keys(fixture).length > 0) {
      setHomeTeam(fixture.homeTeamId);
      setAwayTeam(fixture.awayTeamId);
      setFixtureStatus(fixture.status);
      setHomeGoals(fixture.homeGoals);
      setAwayGoals(fixture.awayGoals);
    }
  }, [fixture]);

  return (
    <Container>
      {isLoading && (
        <div className="customOverlay d-flex flex-column align-items-center justify-content-center">
          <Spinner animation="border" />
          <p className="text-center mt-1">{loadingText}</p>
        </div>
      )}
      <Row className="justify-content-md-center">
        <Col md={12}>
          <Card className="mt-4 custom-card mb-4">
            <Card.Header className="text-center">
              <h2>Edit Fixture</h2>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Form onSubmit={handleSubmitFixture}>
                  <Form.Group controlId="homeTeam">
                    <Form.Label>Home Team</Form.Label>
                    <Form.Control
                      as="select"
                      value={homeTeam || ""}
                      onChange={(e) => setHomeTeam(e.target.value)}
                    >
                      <option value="">Select Home Team</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="awayTeam">
                    <Form.Label>Away Team</Form.Label>
                    <Form.Control
                      as="select"
                      value={awayTeam || ""}
                      onChange={(e) => setAwayTeam(e.target.value)}
                    >
                      <option value="">Select Away Team</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="fixtureStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Control
                      as="select"
                      value={fixtureStatus === null ? "" : fixtureStatus}
                      onChange={(e) => setFixtureStatus(e.target.value)}
                    >
                      <option value="">Select status</option>
                      <option key="0" value="0">
                        Unplayed
                      </option>
                      <option key="1" value="1">
                        Active
                      </option>
                      <option key="2" value="2">
                        Finished
                      </option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="homeGoals">
                    <Form.Label>Home Score</Form.Label>
                    <Form.Control
                      className="w-100"
                      type="number"
                      min="0"
                      placeholder="Home Score"
                      value={homeGoals === null ? "" : homeGoals}
                      onChange={(event) => setHomeGoals(event.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="awayGoals">
                    <Form.Label>Away Score</Form.Label>
                    <Form.Control
                      className="w-100"
                      type="number"
                      min="0"
                      placeholder="Away Score"
                      value={awayGoals === null ? "" : awayGoals}
                      onChange={(event) => setAwayGoals(event.target.value)}
                    />
                  </Form.Group>
                </Form>
              </Row>
              <Row>
                <Col md={4}>
                  <Button
                    className="mb-3 w-100 custom-button"
                    onClick={handleSubmitFixture}
                  >
                    Save Fixture
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <Button
                    variant="danger"
                    className="mb-3 w-100"
                    onClick={() => {
                      setShowDeleteConfirmModal(true);
                    }}
                  >
                    Delete Fixture
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        show={showDeleteConfirmModal}
        onHide={() => {
          setShowDeleteConfirmModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Fixture</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this fixture?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowDeleteConfirmModal(false);
            }}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirmed}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UpdateFixture;
