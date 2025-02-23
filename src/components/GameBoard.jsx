import React, { useState, useEffect } from "react";
import confetti from 'canvas-confetti';

const GameBoard = ({ currentStep, totalSteps, onStepComplete, onExit, words }) => {
  console.log(
    "GameBoard: currentStep=",
    currentStep,
    "totalSteps=",
    totalSteps,
    "words=",
    typeof words === "undefined" ? "undefined" : words === null ? "null" : words.length
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
    console.log(`GameBoard: useEffect2 currentStep=${currentStep} gamewords=${gameWords}`);
    if (!gameWords[currentStep - 1]) {
      console.error("GameBoard: gameWords is empty, currentStep=", currentStep);
      return;
    }
    setStepOptions(gameWords[currentStep - 1]);
  }, [gameWords, currentStep]);

  const handleAnswer = (answer) => {
    if (answer === stepOptions.correct) {
      if (currentStep === totalSteps) {
        playWinningAnimation(2000);
      }
      onStepComplete();
    }
  };

  const playWinningAnimation = (duration) => {
    const end = Date.now() + duration;

    // Create the message element
    const message = document.createElement("div");
    message.classList.add("winning-message"); 
    message.innerText = "Well done, Shira! 🎉";
    document.body.appendChild(message);

    // Confetti animation loop
    const frame = () => {
        confetti({
            particleCount: 5,  
            spread: 360,  
            startVelocity: 30,  
            gravity: 2,  
            scalar: 1.5,  
            origin: { x: 0.5, y: 0.5 }, 
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
        else {
            document.body.removeChild(message);
        }
    };

    frame();
  };

  const handleExit = () => {
    onExit();
  }
  
  return (
    <div className="relative w-full max-w-2xl mx-auto p-6">
      <div className="relative z-10">
        <div className="relative mb-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl mb-4 font-bold text-purple-600">
              {stepOptions?.question}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  className="w-full p-4 text-lg rounded-xl transition-all transform hover:scale-105
                               bg-gradient-to-r from-pink-500 to-purple-500 text-white
                               shadow-lg hover:shadow-xl disabled:opacity-50">
                  {option}
                </button>
              ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-lg md:text-xl">
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        <div className="mt-6 max-w-md mx-auto w-full">
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
