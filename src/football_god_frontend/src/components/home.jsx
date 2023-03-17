import React from 'react';
import { Container, Row, Col, Button, Card, ListGroup } from 'react-bootstrap';
import ICPImage from '../../assets/gold.png'; // Replace this with the actual path to the image file

const Home = () => {
  // Replace this with actual data
  const totalICP = 1989;
  const fixtures = [
    { home: 'Arsenal', away: 'Wolves' },
    { home: 'Aston Villa', away: 'Brighton' },
    { home: 'Brentford', away: 'Man City' },
    { home: 'Chelsea', away: 'Newcastle' },
    { home: 'Crystal Palace', away: 'Nottingham Forest' },
    { home: 'Everton', away: 'Bournemouth' },
    { home: 'Leeds', away: 'Spurs' },
    { home: 'Leicester', away: 'West Ham' },
    { home: 'Man Utd', away: 'Fulham' },
    { home: 'Southampton', away: 'Liverpool' }
  ];

  return (
    <Container className="flex-grow-1">
      <br />
      <Row>
        <Col sm={12} md={4} className="mb-3">
          <h5 className="text-center mb-1">2023/24 Season</h5>
          <h5 className="text-center mb-3">Gameweek 1</h5>
          <br />
          <div className="d-flex justify-content-center mb-3">
            <img src={ICPImage} alt="ICP" style={{ maxWidth: '100px', maxHeight: '50px' }} />
          </div>
          <h2 className="mb-3 text-center">{totalICP} ICP</h2>
          <h2 className="mb-3 text-center">Total Pot</h2>
          <Button variant="primary" size="lg" block>Play</Button>
          <br />
        </Col>
        <Col sm={12} md={8}>
          <h2 className="text-center mb-3">Fixtures</h2>
          <ListGroup>
            {fixtures.map((fixture, index) => (
              <ListGroup.Item key={index} className="text-center">
                {fixture.home} vs {fixture.away}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
