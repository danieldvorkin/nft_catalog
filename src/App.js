import './App.css';
import MenuBar from './components/Navbar/MenuBar';
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
        <MenuBar />
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
