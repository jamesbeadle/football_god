import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import { football_god_backend as football_god_backend_actor } from '../../../declarations/football_god_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../contexts/AuthContext";

const Balances = () => {
  const { authClient } = useContext(AuthContext);
  const identity = authClient.getIdentity();
  Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
  
  const [potBalance, setPotBalance] = useState(0);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  const fetchPotBalance = async () => {
    const balance = await football_god_backend_actor.getPotBalance();
    setPotBalance(balance);
  };

  const fetchUsers = async () => {
    const userList = await football_god_backend_actor.getUsersWithBalances();
    setUsers(userList);
  };

  const handlePageChange = (direction) => {
    setCurrentPage(currentPage + direction);
  };

  useEffect(() => {
    fetchPotBalance();
    fetchUsers();
  }, []);

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={10}>
          <Card className="mt-4">
            <Card.Header className="text-center">
              <h2>Admin Balances</h2>
            </Card.Header>
            <Card.Body>
              <p>Sweepstake Pot Balance: {potBalance} ICP</p>
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
                    <tr key={user.principal}>
                      <td>{user.principal}</td>
                      <td>{user.depositAddress}</td>
                      <td>{user.balance} ICP</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="d-flex justify-content-center">
                <Button onClick={() => handlePageChange(-1)} variant="primary" disabled={currentPage === 1}>
                  Previous
                </Button>
                <span className="mx-3">Page {currentPage}</span>
                <Button
                  onClick={() => handlePageChange(1)}
                  variant="primary"
                  disabled={currentPage * pageSize >= users.length}
                >
                  Next
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Balances;
