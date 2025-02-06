import React, { useState, useEffect } from 'react';
import { words } from '../data/words.js';

const GameBoard = ({ currentStep, totalSteps, onStepComplete }) => {
  console.log('GameBoard: currentStep=', currentStep, 'totalSteps=', totalSteps);

  const [gameWords, setGameWords] = useState([]);
  const [stepOptions, setStepOptions] = useState(null);

  useEffect(() => {
    console.log('GameBoard: useEffect1 currentStep=', currentStep);
    if (currentStep === 1) {
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      setGameWords(() => shuffled.slice(0, totalSteps));
    }
  }, [currentStep]);

  useEffect(() => {
    console.log(`GameBoard: useEffect2 currentStep=${currentStep} gamewords=${gameWords}` );
    if (! gameWords[currentStep-1])
    {
      console.error('GameBoard: gameWords is empty, currentStep=', currentStep);
      return;
    }
    const correct = gameWords[currentStep-1].english
    const related = gameWords[currentStep-1].related;
    const others = words
      .filter(w => w.english !== correct && w.english !== related)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map(w => w.english);

      setStepOptions({
        question: gameWords[currentStep-1].hebrew,
        correct: gameWords[currentStep-1].english,
        related: gameWords[currentStep-1].related,
        other1: others[0],
        other2: others[1]
        });
  }, [gameWords,currentStep]);

  const handleAnswer = (answer) => {
    if (answer === stepOptions.correct) {
          onStepComplete();
    }
  };

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
          { stepOptions &&
            [stepOptions.correct, stepOptions.related, stepOptions.other1, stepOptions.other2]
            .sort(() => Math.random() - 0.5)
            .map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="p-4 text-lg rounded-xl transition-all transform hover:scale-105
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

      </div>
    </div>
  );
};

export default GameBoard;