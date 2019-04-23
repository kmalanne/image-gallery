import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './App.css';
import { Gallery } from './components/Gallery';

interface AppProps {
  uuid: string;
}

export class App extends Component<RouteComponentProps<AppProps>> {
  render() {
    const { params } = this.props.match;
    return (
      <div className="App">
        <header className="App-header">IMAGE GALLERY</header>
        <Gallery album={params.uuid} />
      </div>
    );
  }
}
