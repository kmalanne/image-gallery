import React, { Component } from 'react';
// import { RouteComponentProps } from 'react-router-dom';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { Header } from './components/Header';
import { Gallery } from './containers/Gallery';
import { NotFound } from './containers/NotFound';

// interface AppProps {
//   uuid: string;
// }

// export class App extends Component<RouteComponentProps<AppProps>> {
//   render() {
//     const { params } = this.props.match;
//     return (
//       <div className="App">
//         <header className="App-header">IMAGE GALLERY</header>
//         <Gallery album={params.uuid} />
//       </div>
//     );
//   }
// }

export class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Header />
          <Switch>
            <Route exact path="/:album" component={Gallery} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    );
  }
}
