import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import './index.css';
import { App } from './App';
import { NotFound } from './NotFound';

const routes = (
  <Router>
    <div>
      <Switch>
        <Route exact path="/:uuid" component={App} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </Router>
);

ReactDOM.render(routes, document.getElementById('root'));
