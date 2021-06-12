import './App.scss';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Components
import Nav from './components/Nav';

// Containers
import Home from "./containers/Home"

import { FocusStyleManager } from "@blueprintjs/core";
 
FocusStyleManager.onlyShowFocusOnTabs();

function App() {

  return (
    <div className="App">
        <Router>
          <main>
            <Nav />
            <Switch>
              <Route path="/" exact component={Home} />
              {/* <Route path="/about/:name"  component={About} /> */}
              {/* <Route path="/contact"  component={Contact} /> */}
            </Switch>
          </main>
      </Router>
    </div>
  );
}

export default App;
