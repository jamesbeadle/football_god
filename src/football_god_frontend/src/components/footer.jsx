import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const MyFooter = () => {
  return (
    <footer className="footer mt-auto py-3 bg-light">
      <Container>
        <Row>
          <Col>
            <a href="/terms">Terms</a>
          </Col>
          <Col className="text-right">
            <a href="/privacy">Privacy</a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default MyFooter;
