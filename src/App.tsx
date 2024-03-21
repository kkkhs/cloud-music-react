import React from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { BaseRouter } from './router';
import { Player } from './components/player/player';

function App() {
  return (
    <div className={'fixed top-0 bottom-0 left-0 right-0'}>
      <BrowserRouter>
        <BaseRouter></BaseRouter>
        <Player />
      </BrowserRouter>
    </div>
  );
}

export default App;
