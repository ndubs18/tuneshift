import React from 'react';
import {useState} from 'react';
import './App.css';

import LoginButton from './components/LoginButton';

function App() {

  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("http://localhost:8080/")
      .then((res) => res.json())
      .then((data) => { console.log(data); setData(data)});
  }, []);


  return (
    <div className="App">
      <header className="App-header">
      <LoginButton />
      </header>
    </div>
  );
}

export default App;
