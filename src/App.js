import './App.css';
import logo from './croodles-0.svg';
import { Navbar, Container, Nav } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Homepage from './components/Homepage/Homepage';
import Catalog from './components/Catalog/Catalog';
import Features from './components/Features/Features';

function App() {
  return (
    <div className="App">
      <Router>
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
        <br/>
        <br/>
        <br/>
        <br/>
        <Switch>
          <Route path="/features">
            <Features />
          </Route>
          <Route path="/catalog">
            <Catalog />
          </Route>
          <Route path="/">
            <Homepage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
