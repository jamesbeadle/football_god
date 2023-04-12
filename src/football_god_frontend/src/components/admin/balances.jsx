import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../../contexts/AuthContext";
import { toHexString } from '../helpers';

const Balances = () => {
  const { authClient } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('');
  
  const [potBalance, setPotBalance] = useState(0);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  const fetchPotBalance = async () => {
    if(authClient == null){
      return;
    }
    const balance = await football_god_backend_actor.getGameweekPot();
    setPotBalance(balance);
  };

  const fetchUsers = async () => {
    if(authClient == null){
      return;
    }
    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
    const userList = await football_god_backend_actor.getUsersWithBalances(currentPage, pageSize);
    setUsers(userList);
  };

  const handlePageChange = (direction) => {
    setCurrentPage(currentPage + direction);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchPotBalance();
      await fetchUsers();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    
    <Container>
      {isLoading && (
        <div className="customOverlay d-flex flex-column align-items-center justify-content-center">
          <Spinner animation="border" />
          <p className='text-center mt-1'>{loadingText}</p>
        </div>
      )}
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
                    {users.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((user) => (
                      <tr key={user.principalName}>
                        <td>{user.principalName}</td>
                        <td>{toHexString(user.depositAddress)}</td>
                        <td>{(Number(user.balance) / 1e8).toFixed(4)} ICP</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className="d-flex justify-content-center">
                <Button onClick={() => handlePageChange(-1)} variant="primary" disabled={currentPage === 1}>Previous</Button>
                <span className="mx-3">Page {currentPage}</span>
                <Button
                  onClick={() => handlePageChange(1)}
                  variant="primary"
                  disabled={currentPage * pageSize >= users.length}>Next</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Balances;
