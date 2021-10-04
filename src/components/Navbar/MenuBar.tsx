import logo from '../../croodles-0.svg';
import { Link } from "react-router-dom";
import { Navbar, Container, Nav } from 'react-bootstrap';

const MenuBar = () => (
  <>
    <Navbar bg="light" fixed="top">
      <Container>
        <Navbar.Brand>
          <img src={logo} className="App-logo" alt="logo" />
        </Navbar.Brand>
        <Nav className="me-auto">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/features" className="nav-link">Features</Link>
          <Link to="/catalog" className="nav-link">Catalog</Link>
        </Nav>
      </Container>
    </Navbar>
  </>
);

export default MenuBar;
