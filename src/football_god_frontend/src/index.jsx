import * as React from "react";
import { render } from "react-dom";
import { football_god_backend } from "../../declarations/football_god_backend";
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavbar from './components/navbar';
import MyFooter from './components/footer';
import { Container } from 'react-bootstrap';

const MyHello = () => {
  const [name, setName] = React.useState('');
  const [message, setMessage] = React.useState('');

  async function doGreet() {
    const greeting = await football_god_backend.greet(name);
    setMessage(greeting);
  }

  return (
    <div className="d-flex flex-column min-vh-100">
    <MyNavbar />
    <Container className="flex-grow-1">
      <p>Content here</p>
    </Container>
    <MyFooter />
  </div>
  );
};

render(<MyHello />, document.getElementById("app"));
