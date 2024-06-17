import React from 'react';
import {useState} from 'react';
import './App.css';

import LoginButton from './components/LoginButton/LoginButton';
import SpotifyLogo from './assets/images/spotify_icon.svg';
import AppleLogo from './assets/images/apple_music_icon.svg'
import BidirectionalArrow from './assets/images/double_arrow_icon.svg'

function App() {
  return (
    <div className="App">
      <h1>TuneShift</h1>
      <header className="App-header">
        <h4>Select the source platform</h4>
        <div className='sourceSelection'>
          <div className='sourceCard'>
            <img src={SpotifyLogo} alt="spotify image" />
            <LoginButton name="Spotify"/>
          </div>
          <span><img src={BidirectionalArrow} title="arrow icon"/></span>  
          <div className='sourceCard'>
            <img src={AppleLogo} alt="apple music image" />
            <LoginButton name="Apple Music"/>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
