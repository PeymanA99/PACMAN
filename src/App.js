import React, { useState, useEffect } from "react";
import Header from './components/Header';
import Board from './components/Board';

function App() {
  const [score, setScore] = useState(0);
  const boardWidth = (Math.floor((window.innerWidth-20)/50)*50);
  const boardHeight = (Math.floor((window.innerHeight-20-50)/50)*50);

  return (
    <div className="App">

      <Header score={score}/>
      <Board score={score} setScore={setScore} boardWidth={boardWidth} boardHeight={boardHeight}/>
    </div>
  );
}

export default App;
