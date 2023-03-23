import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Admin = () => {
  // Replace these values with the actual data from your canister
  const currentSeason = '2023';
  const currentGameweek = '12';
  const currentState = 'Open';

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card className="mt-4">
            <Card.Header className="text-center">
              <h2>Admin</h2>
            </Card.Header>
            <Card.Body>
              <p className="mt-3">
                <strong>Current Season:</strong> {currentSeason}
              </p>
              <p>
                <strong>Current Gameweek:</strong> {currentGameweek}
              </p>
              <p>
                <strong>Gameweek State:</strong> {currentState}
              </p>
              <LinkContainer to="/system-state">
                <Button variant="primary" className="mb-4 w-100">
                  Set System State
                </Button>
              </LinkContainer>
              <Row className="mt-3">
                <Col xs={12} md={6} className="mb-3">
                  <LinkContainer to="/seasons">
                    <Button variant="success" className="w-100">Manage Seasons</Button>
                  </LinkContainer>
                </Col>
                <Col xs={12} md={6} className="mb-3">
                  <LinkContainer to="/teams">
                    <Button variant="success" className="w-100">Manage Teams</Button>
                  </LinkContainer>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={6} className="mb-3">
                  <LinkContainer to="/fixtures">
                    <Button variant="success" className="w-100">Manage Fixtures</Button>
                  </LinkContainer>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Admin;
