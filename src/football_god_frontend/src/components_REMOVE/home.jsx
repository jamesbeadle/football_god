import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { football_god_backend as football_god_backend_actor } from "../../../declarations/football_god_backend";
import ICPImage from "../../assets/gold.png";
import { AuthContext } from "../contexts_REMOVE/AuthContext";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, login } = useContext(AuthContext);
  const [viewData, setViewData] = useState(null);
  const [loadingPotBalance, setLoadingPotBalance] = useState(true);
  const [balanceData, setBalanceData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await fetchViewData();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!viewData) {
      return;
    }
    const fetchData = async () => {
      await fetchPotBalance();
      setLoadingPotBalance(false);
    };
    fetchData();
  }, [viewData]);

  const fetchViewData = async () => {
    const data = await football_god_backend_actor.getHomeDTO();
    setViewData(data);
  };

  const fetchPotBalance = async () => {
    const data = await football_god_backend_actor.getGameweekPotDTO();
    setBalanceData(data);
  };

  return isLoading ? (
    <div className="customOverlay d-flex flex-column align-items-center justify-content-center">
      <Spinner animation="border" />
      <p className="text-center mt-1">Loading</p>
    </div>
  ) : viewData.systemUpdating ? (
    <Container className="flex-grow-1">
      <br />
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100%" }}
      >
        <h2>System being updated</h2>
      </div>
    </Container>
  ) : (
    <Container className="flex-grow-1">
      <br />
      <Row>
        <Col sm={12} md={4} className="mb-3">
          <h5 className="text-center mb-1">
            {viewData.activeSeasonName} Season
          </h5>
          <h5 className="text-center mb-3">
            Gameweek {viewData.activeGameweekNumber}
          </h5>
          <br />
          <div className="d-flex justify-content-center mb-3">
            <img
              src={ICPImage}
              alt="ICP"
              style={{ maxWidth: "100px", maxHeight: "50px" }}
            />
          </div>
          {loadingPotBalance ? (
            <div className="d-flex flex-column align-items-center justify-content-center">
              <Spinner animation="border" />
              <p className="text-center mt-1">Loading Pot</p>
            </div>
          ) : (
            <h2 className="mb-3 text-center">
              {(Number(balanceData.gameweekPot) / 1e8).toFixed(0)} ICP
            </h2>
          )}
          <h2 className="mb-3 text-center">Total Pot</h2>
          {!isAuthenticated && (
            <Button
              onClick={() => {
                login();
              }}
              className="w-100 mb-3 custom-button"
              size="lg"
            >
              Sign In To Play
            </Button>
          )}
          {viewData.gameweekStatus === 1 && isAuthenticated && (
            <LinkContainer to="/play">
              <Button className="w-100 mb-3 custom-button" size="lg">
                Play
              </Button>
            </LinkContainer>
          )}
          {(viewData.gameweekStatus === 2 || viewData.gameweekStatus === 3) && (
            <LinkContainer to="/leaderboard">
              <Button className="w-100 custom-button" size="lg">
                Leaderboard
              </Button>
            </LinkContainer>
          )}
          {isAuthenticated &&
            viewData.hasPredictions &&
            (viewData.gameweekStatus === 2 ||
              viewData.gameweekStatus === 3) && (
              <LinkContainer
                className="mt-3"
                to={`/view-prediction/${viewData.principalName}/${viewData.activeSeasonId}/${viewData.activeGameweekNumber}`}
              >
                <Button className="w-100  custom-button" size="lg">
                  View Current Predictions
                </Button>
              </LinkContainer>
            )}

          <br />
        </Col>
        <Col sm={12} md={8}>
          <h2 className="text-center mb-3 mt-2 mt-md-3">Fixtures</h2>
          <div className="mb-3">
            {viewData.fixtures.map((fixture, index) => (
              <Row
                key={index}
                className={`text-center fixture-row ml-3 mr-3${
                  index !== 0 ? " mt-2" : ""
                }`}
              >
                <Col>
                  {fixture.homeTeamName} v {fixture.awayTeamName}
                  {fixture.status === 2 && (
                    <span>
                      <br />
                      {fixture.homeTeamGoals}-{fixture.awayTeamGoals}
                    </span>
                  )}
                </Col>
              </Row>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
