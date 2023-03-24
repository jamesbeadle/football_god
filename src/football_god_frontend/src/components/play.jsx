import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

const Play = () => {
  const [scores, setScores] = useState({});

  const handleChange = (event, fixtureId, team) => {
    const updatedScores = { ...scores };
    if (!updatedScores[fixtureId]) {
      updatedScores[fixtureId] = {};
    }
    updatedScores[fixtureId][team] = parseInt(event.target.value);
    setScores(updatedScores);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(scores);
  };

  const fixtures = [
    { id: 1, home: 'Team A', away: 'Team B' },
    { id: 2, home: 'Team C', away: 'Team D' },
  ];

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card className="mt-4">
            <Card.Header className="text-center">
              <h2>Play</h2>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                {fixtures.map((fixture) => (
                  <Form.Group key={fixture.id} as={Row} className="mb-3">
                    <Col xs={3}>
                      <Form.Control
                        className="w-100"
                        type="number"
                        min="0"
                        placeholder="Home"
                        value={scores[fixture.id]?.home || ''}
                        onChange={(event) => handleChange(event, fixture.id, 'home')}
                      />
                    </Col>
                    <Col xs={6} className="text-center">
                      {fixture.home} vs {fixture.away}
                    </Col>
                    <Col xs={3}>
                      <Form.Control 
                        className="w-100"
                        type="number"
                        min="0"
                        placeholder="Away"
                        value={scores[fixture.id]?.away || ''}
                        onChange={(event) => handleChange(event, fixture.id, 'away')}
                      />
                    </Col>
                  </Form.Group>
                ))}
                <div className="text-center">
                  <Button type="submit" variant="primary">Save Scores</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Play;
