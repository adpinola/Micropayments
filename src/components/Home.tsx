import React, { FC } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import '../styles/Home.scss';

const Home: FC = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">Micropayments Factory</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll" className="justify-content-end">
          <Nav>
            <Nav.Link href="/company">Company</Nav.Link>
            <Nav.Link href="/contractor">Contractor</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Home;
