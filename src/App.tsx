import React from 'react';
import {useState} from 'react';
import './App.css';

import LoginButton from './components/LoginButton';

function App() {
  return (
    <div className="App">
      <h1>Source Platform</h1>
      <header className="App-header">
      <LoginButton name="Spotify"/> 
      <LoginButton name="Apple Music"/>
      </header>
    </div>
  );
}

export default App;
