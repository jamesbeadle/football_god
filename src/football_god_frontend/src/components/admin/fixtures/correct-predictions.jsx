import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, ButtonGroup, Table, Spinner } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import "../../../../assets/main.css";
import { football_god_backend as football_god_backend_actor } from '../../../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../../../contexts/AuthContext";
import { useParams } from 'react-router-dom';

const CorrectPredictions = () => {
  const { seasonId, gameweekNumber, fixtureId } = useParams();
  const { authClient } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [viewData, setViewData] = useState(null);
  const [page, setPage] = useState(0);
  const count = 25;

  useEffect(() => {
    const fetchData = async () => {
      await fetchViewData();
    };
    fetchData();
  }, []);

  useEffect(() => {

    setIsLoading(true);
    
    const fetchData = async () => {
        await fetchViewData();
    };
    fetchData();
    
  }, [page]);

  const fetchViewData = async () => {
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    const data = await football_god_backend_actor.getCorrectPredictionsDTO(Number(seasonId), Number(gameweekNumber), Number(fixtureId), Number(page), Number(count));
    setViewData(data);
    setIsLoading(false);
  };

  const handlePageChange = (change) => {
    setPage((prevPage) => prevPage + change);
  };

  return (
    <Container>
      {isLoading ? (
        <div className="customOverlay d-flex flex-column align-items-center justify-content-center">
          <Spinner animation="border" />
          <p className='text-center mt-1'>Loading Correct Predictions</p>
        </div>
      ) : 
      <Row className="justify-content-md-center">
        <Col md={12}>
          <Card className="mt-4 custom-card mb-4">
            <Card.Header className="text-center">
              <h2>Correct Predictions</h2>
            </Card.Header>
            <Card.Body>
                <p className="mt-3">
                    <strong>Season:</strong> {viewData.seasonName}
                </p>
                <p className="mt-3">
                    <strong>Gameweek:</strong> {viewData.gameweekNumber}
                </p>
                <p className="mt-3">
                    <strong>Fixture:</strong> {viewData.homeTeamName} v {viewData.awayTeamName}
                </p>
                <p className="mt-3">
                    <strong>Result:</strong> {viewData.homeTeamGoals} - {viewData.awayTeamGoals}
                </p>
                
                <div className="table-responsive">
                  <Table className="custom-table" bordered>
                      <thead>
                          <tr>
                              <th>Principal Name</th>
                              <th>Display Name</th>
                              <th>Options</th>
                          </tr>
                      </thead>
                      <tbody>
                          {viewData.predictions.map((submission) => (
                          <tr key={submission.principalName}>
                              <td>{submission.principalName}</td>
                              <td>{submission.displayName}</td>
                              <td>
                                  <LinkContainer to={`/view-prediction/${submission.principalName}/${viewData.seasonId}/${viewData.gameweekNumber}`}>
                                      <Button className="mb-4 w-100 custom-button">
                                          View
                                      </Button>
                                  </LinkContainer>
                              </td>
                          </tr>
                          ))}
                      </tbody>
                  </Table>
                  <div className="d-flex justify-content-center mt-3 mb-3">
                    <ButtonGroup>
                      <Button onClick={() => handlePageChange(-1)} className="custom-button" disabled={page === 0}>
                        Prior
                      </Button>
                      <div className="d-flex align-items-center mr-3 ml-3">
                        <p className="mb-0">Page {page + 1}</p>
                      </div>
                      <Button onClick={() => handlePageChange(1)} className="custom-button" disabled={(page + 1) * count >= viewData.totalEntries}>
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
