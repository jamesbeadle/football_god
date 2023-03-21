import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const MyFooter = () => {
  return (
    <footer className="footer mt-auto py-3 bg-light">
      <Container>
        <Row>
          <Col className="text-center">
          <LinkContainer to="/game-rules">
            <Button >Rules</Button>
          </LinkContainer>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default MyFooter;
