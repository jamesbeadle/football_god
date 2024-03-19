import { Button, Col, Container, Row } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const MyFooter = () => {
  return (
    <footer className="footer mt-auto py-3 custom-footer">
      <Container>
        <Row>
          <Col className="text-center">
            <LinkContainer to="/game-rules">
              <Button className="custom-button">Rules</Button>
            </LinkContainer>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default MyFooter;
