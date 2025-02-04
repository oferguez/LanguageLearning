import React, { useState } from 'react';
import { Popcorn as Unicorn } from 'lucide-react';
import GameBoard from './components/GameBoard';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const TOTAL_STEPS = 5;

  const startNewGame = () => {
    setGameStarted(true);
    setGameCompleted(false);
  };

  const handleGameComplete = () => {
    setGameCompleted(true);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-purple-600 mb-8">
            Hebrew Learning Adventure!
          </h1>
          <button
            onClick={startNewGame}
            className="px-8 py-4 text-xl bg-gradient-to-r from-pink-500 to-purple-500
                     text-white rounded-full shadow-lg hover:shadow-xl
                     transform transition-all hover:scale-105"
          >
            Start Learning!
          </button>
        </div>
      </div>
    );
  }

  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Unicorn className="w-24 h-24 mx-auto text-purple-500 mb-8" />
          <h2 className="text-4xl font-bold text-purple-600 mb-4">
            Amazing Job! 🎉
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            You've learned all the words!
          </p>
          <button
            onClick={startNewGame}
            className="px-8 py-4 text-xl bg-gradient-to-r from-pink-500 to-purple-500
                     text-white rounded-full shadow-lg hover:shadow-xl
                     transform transition-all hover:scale-105"
          >
            Play Again!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 p-4">
      <GameBoard 
        totalSteps={TOTAL_STEPS}
        onGameComplete={handleGameComplete}
      />
    </div>
  );
}

export default App;