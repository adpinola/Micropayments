import React, { FC } from 'react';
import { Col, Container, Image, Nav, Navbar, Row } from 'react-bootstrap';
import '../styles/Home.scss';
import Logo from '../assets/ethereum-logo.svg';

const Home: FC = () => (
  <div id="home">
    <Navbar bg="primary" expand="lg" className="navbar" fixed="top">
      <Container>
        <Navbar.Brand href="#">Micropayments Factory</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll" className="justify-content-end">
          <Nav>
            <Nav.Link href="#/company">Company</Nav.Link>
            <Nav.Link href="#/contractor">Contractor</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <Container className="content">
      <Row>
        <Col>
          <div>
            <h2>Manage payments using this integrated platform.</h2>
            <h4>Just create contracts and enable payments by delivering a signed message. Easy for you as employer or employee.</h4>
          </div>
        </Col>
        <Col>
          <Image width="150" src={Logo} />
        </Col>
      </Row>
    </Container>
  </div>
);

export default Home;
