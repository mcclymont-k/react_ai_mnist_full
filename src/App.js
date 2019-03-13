import React, { Component } from 'react';
import './App.css';
import Canvas from './components/Canvas'

class App extends Component {
  render() {
    return (
      <div>
        <link href="https://fonts.googleapis.com/css?family=Roboto+Slab" rel="stylesheet" /> 
        <Canvas />
      </div>
    );
  }
}

export default App;
