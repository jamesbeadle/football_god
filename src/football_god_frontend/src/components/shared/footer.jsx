import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const MyFooter = () => {
  return (
    <footer className="footer mt-auto py-3 bg-light">
      <Container>
        <Row>
          <Col className="text-center">
            <a href="/game-rules">Game Rules</a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default MyFooter;
