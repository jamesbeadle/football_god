import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

const Play = () => {
  const [scores, setScores] = useState({}); // Store scores in an object

  const handleChange = (event, fixtureId) => {
    const updatedScores = { ...scores };
    updatedScores[fixtureId] = event.target.value;
    setScores(updatedScores);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Save the scores here
    console.log(scores);
  };

  // Dummy fixtures data
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
                    <Form.Label column sm={4} className="text-right">
                      {fixture.home} vs {fixture.away}
                    </Form.Label>
                    <Col sm={4}>
                      <Form.Control
                        type="number"
                        min="0"
                        placeholder="Enter score"
                        value={scores[fixture.id] || ''}
                        onChange={(event) => handleChange(event, fixture.id)}
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
