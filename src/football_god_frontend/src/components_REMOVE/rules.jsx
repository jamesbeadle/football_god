import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Rules = () => {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card className="mt-4 custom-card mb-4">
            <Card.Header className="text-center">
              <h2>Game Rules</h2>
            </Card.Header>
            <Card.Body>
              <ul>
                <li>
                  Each player must submit their predictions for the open game week.
                </li>
                <li>
                  Predictions must be submitted before the game week deadline specified on the website.
                </li>
                <li>
                  Players must pay 1 ICP to enter the week's competition.
                </li>
                <li>
                  Predictions must include the final score for each fixture in the game week.
                </li>
                <li>
                  The player(s) with the highest correct results for the game week who have entered the sweepstake will win a share of the total ICP pot.
                </li>
                <li>
                  In case of a tie, the total ICP pot will be divided equally among the tied players.
                </li>
                <li>
                  If a free playing user gets every prediction correct for the gameweek then they will also receive a share of the total ICP pot.
                </li>
                <li>
                  Winners will be announced and paid out after the game week has been finalized.
                </li>
                <li>
                  Players can view the leaderboard to check their performance and ranking.
                </li>
                <li>
                  By participating in the game, players agree to follow the rules and any other terms and conditions specified on the website.
                </li>
              </ul>
              <p className="mt-3">
                <strong>Note:</strong> We take a 5% fee from the total pot. This fee helps maintain the platform and cover operational costs.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Rules;
