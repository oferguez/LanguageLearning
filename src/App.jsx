import React, { useEffect, useState } from 'react';
import UnicornReveal from './components/UnicornReveal';
import GameBoard from './components/GameBoard';
import { ConfigModal, RetrieveConfig, SaveConfig } from './components/Preferences';
import { getCurrentUser as getCurrentPlayer, PlayerSelection } from "./components/PlayerSelection.jsx";

function App() {
  console.log('APP: Start');

  const [step, setStep] = useState(0);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [config, setConfig] = useState(null);
  const [playerName, setPlayerName] = useState('Shira');


  useEffect(() => {
    console.log('APP: useEffect 1');
    setIsConfigOpen(false);
    try {
      RetrieveConfig(playerName).then((retrievedConfig) => {
        console.log('APP: useEffect 2: ',
          typeof retrievedConfig === "undefined" ? "undefined" : retrievedConfig === null ? "null" : JSON.stringify(retrievedConfig)
        );

        if (retrievedConfig) {
          setConfig(retrievedConfig);
        }

        console.log(retrievedConfig);
      });
      console.log('APP: useEffect 3');
    } catch (error) {
      console.error('APP: useEffect: error:', error);
    }
  }, []);

  const startNewGame = () => {
    setStep(() => 1);
  };

  const handleStepComplete = () => {
    setStep((prev) => prev < config.steps ? prev + 1 : 0);
  }

  // open/close/save config 

  const OpenCloseConfig = (isConfigOpen) => {
    setIsConfigOpen(() => isConfigOpen);
  }

  const onSaveConfig = (newConfig) => {
    setConfig(() => newConfig);
    SaveConfig(playerName, newConfig);
    setIsConfigOpen(false);
  }

  const onExit = () => {
    setStep(() => 0);
  }

  let game;

  // className="px-8 py-4 ml-4 text-xl bg-gradient-to-r from-pink-500 to-purple-500
  // text-white rounded-full shadow-lg hover:shadow-xl
  // transform transition-all hover:scale-105"


  if (step === 0) {
    console.log('APP: Init: step is 0');
    game = config && (
      <>
        <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-purple-600 mb-8">
              <p className='text-8xl'>Shira's</p>
              <p>Language Learning Adventure!</p>
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={startNewGame}
                className="px-8 py-4 text-xl bg-gradient-to-r from-pink-500 to-purple-500
                      text-white rounded-full shadow-lg hover:shadow-xl
                      transform transition-all hover:scale-105"
              > Start Learning! </button>
              <button
                className="px-8 py-4 ml-4 text-xl bg-gradient-to-r from-pink-500 to-purple-500
                      text-white rounded-full shadow-lg hover:shadow-xl
                      transform transition-all hover:scale-105"
                onClick={() => OpenCloseConfig(true)}
              > Configure </button>
              <PlayerSelection
                className="flex px-8 py-2 ml-4 text-xl bg-gradient-to-r from-pink-500 to-purple-500
                text-white rounded-full shadow-lg transform transition-all"
                selectedPlayerName={getCurrentPlayer()} updateSelectedPlayerName={setPlayerName} />
            </div>
          </div>

          <UnicornReveal counter={0} steps={config.steps} searchWords={config.searchWords} />

        </div>
        <ConfigModal isOpen={isConfigOpen} onClose={() => OpenCloseConfig(false)} onSave={onSaveConfig} config={config} />
      </>
    );
  }
  else if (step > config.steps) {
    console.log(`APP: GameOver: step:${step} > ${config.steps}`);
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
        <UnicornReveal counter={step} steps={config.steps} searchWords={config.searchWords} />
      </>
    );
  }
  else {
    console.log(`APP: InGame: step:${step}`);
    game = (
      <>
        <div className="min-h-screen bg-gradient-to-br from-pink-100/5 to-purple-100/5 p-4">
          <GameBoard currentStep={step} totalSteps={config.steps} onStepComplete={handleStepComplete} onExit={onExit} words={config.words} />
        </div>
        <UnicornReveal counter={step} steps={config.steps} searchWords={config.searchWords} />
      </>
    );
  }

  return game;
}

export default App;

