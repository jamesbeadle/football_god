import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Gameweeks = () => {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card className="mt-4">
            <Card.Header className="text-center">
              <h2>Gameweeks</h2>
            </Card.Header>
            <Card.Body>
              <p className="mt-3">
                <strong>Gameweek Management:</strong> Update gameweek data.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Gameweeks;
