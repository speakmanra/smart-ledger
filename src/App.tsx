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
import { useState } from 'react';
FocusStyleManager.onlyShowFocusOnTabs();

function App() {
  const ls = localStorage.getItem('contrastMode');
  const parsedLS = ls ? JSON.parse(ls) : null;
  const [isDarkMode, setMode] = useState<boolean>(ls ? (parsedLS === 'dark' ? true : false) : true);

  const handleChangeMode = (mode: boolean) => {
    setMode(mode);
    localStorage.setItem('contrastMode', JSON.stringify(mode ? 'dark' : 'light'));
  }

  return (
    <div style={{backgroundColor: isDarkMode ? '#0f1318' : '#e7dbda', color: isDarkMode ? '#e7dbda' : '#0f1318', minHeight: '100vh'}} className="App">
        <Router>
          <main>
            <Nav isDarkMode={isDarkMode} changeContrastMode={(mode: boolean) => handleChangeMode(mode)} />
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
