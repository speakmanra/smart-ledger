import './App.scss';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";


// Components
import Nav from './components/Nav';

// Containers
import Home from "./containers/Home"
import Wallets from './containers/Wallets';
import GlobalStats from './containers/GlobalStats';
import Donations from './containers/Donations';

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
              <Route path="/wallets" exact component={Wallets} />
              <Route path="/global-stats" exact component={GlobalStats} />
              <Route path="/donations" exact component={Donations} />
            </Switch>
          </main>
        </Router>
    </div>
  );
}

export default App;
