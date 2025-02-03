// import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useSearchParams, Outlet, useOutletContext } from 'react-router-dom';
import './App.css';

import TuneshiftLogo from './assets/images/TuneShiftLogo.png';
import abstractImg from './assets/images/015.png'
import Phone from './assets/images/phoneIllustration.svg';
import LoginButton from './components/LoginButton/LoginButton';
import SpotifyLogo from './assets/images/spotify_icon.svg';
import AppleLogo from './assets/images/apple_music_icon.svg'
import BidirectionalArrow from './assets/images/double_arrow_icon.svg'
import { Song } from './types/types';
import Navbar from './components/Navbar/Navbar';

type ContextType = {
  sourcePlatform: string | null,
  sourcePlaylist: Song[] | null,
  errorSongs: Song[] | null;
  setSourcePlaylist: (songs: Song[]) => void,
}

function App() {

  return (
    <div className="App">
      <div className="container">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}


export default App;
