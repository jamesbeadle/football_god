import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Table, Button, ButtonGroup, Spinner } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../../contexts/AuthContext";
import { toHexString } from '../helpers';

const Balances = () => {
  const { authClient } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  
  const [potBalance, setPotBalance] = useState(0);
  const [users, setUsers] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  const fetchPotBalance = async () => {
    setIsLoading(true);
    const balance = await football_god_backend_actor.getGameweekPot();
    setPotBalance(balance);
  };

  const fetchUsers = async () => {
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    const userList = await football_god_backend_actor.getUsersWithBalances(currentPage, pageSize);
    setUsers(userList[0]);
  };

  const handlePageChange = (change) => {
    setCurrentPage((prevPage) => prevPage + change);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchPotBalance();
      await fetchUsers();
      setIsLoading(false);
    };
    fetchData();
  }, [currentPage]);

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
          <Card className="mt-4">
            <Card.Header className="text-center">
              <h2>Admin Balances</h2>
            </Card.Header>
            <Card.Body>
              <p>Sweepstake Pot Balance: {(Number(potBalance) / 1e8).toFixed(4)} ICP</p>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>User Principal</th>
                      <th>Deposit Address</th>
                      <th>Balance (ICP)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users && users.entries.map((user) => (
                        <tr key={user.principalName}>
                          <td>{user.principalName}</td>
                          <td>{toHexString(user.depositAddress)}</td>
                          <td>{(Number(user.balance) / 1e8).toFixed(4)} ICP</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
              <div className="d-flex justify-content-center mt-3">
                    <ButtonGroup>
                      <Button onClick={() => handlePageChange(-1)} variant="primary" disabled={currentPage === 0}>
                        Prior
                      </Button>
                      <Button onClick={() => handlePageChange(1)} variant="primary" disabled={(currentPage + 1) * pageSize >= users.totalEntries}>
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
