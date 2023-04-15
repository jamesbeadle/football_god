import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Table, Button, ButtonGroup, Spinner } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../../contexts/AuthContext";

const Balances = () => {
  const { authClient } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [viewData, setViewData] = useState(null);
  const [page, setPage] = useState(1);
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
    const data = await football_god_backend_actor.getUserBalancesDTO(Number(page), Number(count));
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
          <p className='text-center mt-1'>Loading Balances</p>
        </div>
      ) : 
      
      <Row className="justify-content-md-center">
        <Col md={10}>
          <Card className="mt-4 custom-card mb-4">
            <Card.Header className="text-center">
              <h2>Admin Balances</h2>
            </Card.Header>
            <Card.Body>
              <p>Sweepstake Pot Balance: {(Number(viewData.potAccountBalance) / 1e8).toFixed(4)} ICP</p>
              <div className="table-responsive">
                <Table className="custom-table" bordered>
                  <thead>
                    <tr>
                      <th>User Principal</th>
                      <th>Balance (ICP)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewData.userBalances.map((user) => (
                        <tr key={user.principalName}>
                          <td>{user.principalName}</td>
                          <td>{(Number(user.balance) / 1e8).toFixed(4)} ICP</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
              <div className="d-flex justify-content-center mt-3">
                    <ButtonGroup>
                      <Button onClick={() => handlePageChange(-1)} className="custom-button" disabled={page === 1}>
                        Prior
                      </Button>
                      <div className="d-flex align-items-center mr-3 ml-3">
                        <p className="mb-0">Page {page}</p>
                      </div>
                      <Button onClick={() => handlePageChange(1)} className="custom-button" disabled={(page + 1) * count >= viewData.totalEntries}>
                        Next
                      </Button>
                    </ButtonGroup>
                  </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      }
    </Container>
  );
};

export default Balances;
