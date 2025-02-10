import React, { useState, useEffect } from "react";

const GameBoard = ({ currentStep, totalSteps, onStepComplete, onExit, words }) => {
  console.log(
    "GameBoard: currentStep=",
    currentStep,
    "totalSteps=",
    totalSteps,
  );

  const [gameWords, setGameWords] = useState([]);
  const [stepOptions, setStepOptions] = useState(null);

  useEffect(() => {
    console.log("GameBoard: useEffect1 currentStep=", currentStep);
    if (currentStep === 1) {
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      setGameWords(() => shuffled.slice(0, totalSteps));
    }
  }, [currentStep]);

  useEffect(() => {
    console.log(
      `GameBoard: useEffect2 currentStep=${currentStep} gamewords=${gameWords}`,
    );
    if (!gameWords[currentStep - 1]) {
      console.error("GameBoard: gameWords is empty, currentStep=", currentStep);
      return;
    }
    setStepOptions(gameWords[currentStep - 1]);
  }, [gameWords, currentStep]);

  const handleAnswer = (answer) => {
    if (answer === stepOptions.correct) {
      if (currentStep === totalSteps) {
        playWinningAnimation();
      }
      onStepComplete();
    }
  };

  const playWinningAnimation = () => {
    const confetti = require('canvas-confetti');
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      spread: 360,
      ticks: 50,
      gravity: 0.8,
      decay: 0.94,
      startVelocity: 30,
      shapes: ['star'],
      colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const handleExit = () => {
    onExit();
  }
  
  return (
    <div className="relative w-full max-w-2xl mx-auto p-6">
      <div className="relative z-10">
        <div className="relative mb-8">
          <div className="text-center">
            <h2 className="text-6xl mb-4 font-bold text-purple-600">
              {stepOptions?.question}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {stepOptions &&
            [
              stepOptions.correct,
              stepOptions.related,
              stepOptions.other1,
              stepOptions.other2,
            ]
              .sort(() => Math.random() - 0.5)
              .map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="w-[300px] p-4 text-lg rounded-xl transition-all transform hover:scale-105
                               bg-gradient-to-r from-pink-500 to-purple-500 text-white
                               shadow-lg hover:shadow-xl disabled:opacity-50">
                  {option}
                </button>
              ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        <div className="mt-6 max-w-[calc(400px+1rem)] mx-auto w-full">
          <button
            onClick={handleExit}
            className="w-full p-4 text-lg rounded-xl transition-all transform hover:scale-105
              bg-gradient-to-r from-pink-500 to-purple-500 text-white
              shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
