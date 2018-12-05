import React, { Component } from 'react';
import logo from './busbud-search.svg';
import './App.css';
import SearchBar from './components/SearchBar/SearchBar';

class App extends Component {

  render() {

    return (
      <div className="App">
        <img src={logo} alt="Busbud Search logo" className="logo" />
        <SearchBar />
      </div>
    );
  }
}

export default App;
