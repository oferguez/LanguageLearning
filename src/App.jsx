import React, { useState } from 'react';
import UnicornReveal from './components/UnicornReveal';
import GameBoard from './components/GameBoard';
import {ConfigModal} from './components/Preferences';


const TOTAL_STEPS = 10;

function App() {
  const [step, setStep] = useState(0);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [config, setConfig] = useState({});

  // open/close game

  const startNewGame = () => {
    setStep(() => 1);
  };

  const handleStepComplete = () => {
    setStep((prev) => prev < TOTAL_STEPS ? prev + 1 : 0);
  }
  
  // open/close/save config 

  const OpenCloseConfig = (isConfigOpen) => {
    setIsConfigOpen(() => isConfigOpen);
  } 

  const onSaveConfig = (newConfig) => {
    setConfig(() => newConfig);
  }


  let game;

  if (step === 0) {
    game = (
      <>
        <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-purple-600 mb-8">
              Language Learning Adventure!
            </h1>
            <button
              onClick={startNewGame}
              className="px-8 py-4 text-xl bg-gradient-to-r from-pink-500 to-purple-500
                      text-white rounded-full shadow-lg hover:shadow-xl
                      transform transition-all hover:scale-105"
            > Start Learning! </button>
            <button
              className="ml-4 px-8 py-4 text-xl bg-gradient-to-r from-pink-500 to-purple-500
                      text-white rounded-full shadow-lg hover:shadow-xl
                      transform transition-all hover:scale-105"
              onClick = {() => OpenCloseConfig(true)}
            > Configure </button>
          </div>
          <UnicornReveal counter={0} steps={TOTAL_STEPS} />
        </div>
        <ConfigModal isOpen={isConfigOpen} onClose={() => OpenCloseConfig(false)} onSave={onSaveConfig} />
      </>
      );
  }
  else if (step > TOTAL_STEPS) {
    game = (
      <>
        <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
          <div className="text-center">
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
        <UnicornReveal counter={step} steps={TOTAL_STEPS} />
      </>
    );
  }
  else {
    game = (
      <>
        <div className="min-h-screen bg-gradient-to-br from-pink-100/5 to-purple-100/5 p-4">
          <GameBoard currentStep={step} totalSteps={TOTAL_STEPS} onStepComplete={handleStepComplete} />      
        </div>
        <UnicornReveal counter={step} steps={TOTAL_STEPS} />
      </>  
    );
  }

  return game;
}  

export default App;

