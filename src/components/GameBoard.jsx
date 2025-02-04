import React, { useState, useEffect } from 'react';
import { Sparkles, PartyPopper as Party, Stars, Rocket, Crown } from 'lucide-react';
import { words } from '../data/words.js';

const ANIMATIONS = [
  { icon: Sparkles, color: 'text-yellow-400', animation: 'animate-spin' },
  { icon: Party, color: 'text-pink-500', animation: 'animate-bounce' },
  { icon: Stars, color: 'text-purple-500', animation: 'animate-pulse' },
  { icon: Rocket, color: 'text-blue-500', animation: 'animate-ping' },
  { icon: Crown, color: 'text-amber-500', animation: 'animate-bounce' }
];

const GameBoard = ({ totalSteps, onGameComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [gameWords, setGameWords] = useState([]);
  const [options, setOptions] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState(ANIMATIONS[0]);
  const [revealedParts, setRevealedParts] = useState(0);

  useEffect(() => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setGameWords(shuffled.slice(0, totalSteps));
  }, [totalSteps]);

  useEffect(() => {
    if (gameWords[currentStep]) {
      const correct = gameWords[currentStep].english;
      const related = gameWords[currentStep].related;
      const others = words
        .filter(w => w.english !== correct && w.english !== related)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2)
        .map(w => w.english);
      
      setOptions([correct, related, ...others].sort(() => Math.random() - 0.5));
    }
  }, [currentStep, gameWords]);

  const handleAnswer = (answer) => {
    if (answer === gameWords[currentStep].english) {
      // Select random animation
      const randomAnimation = ANIMATIONS[Math.floor(Math.random() * ANIMATIONS.length)];
      setCurrentAnimation(randomAnimation);
      setShowAnimation(true);
      setRevealedParts(prev => prev + 1);
      
      setTimeout(() => {
        setShowAnimation(false);
        if (currentStep + 1 === totalSteps) {
          onGameComplete();
        } else {
          setCurrentStep(prev => prev + 1);
        }
      }, 1500);
    }
  };

  if (!gameWords[currentStep]) return null;

  const AnimationIcon = currentAnimation.icon;
  const revealPercentage = (revealedParts / totalSteps) * 100;

  return (
    <div className="relative w-full max-w-2xl mx-auto p-6">
      {/* Background container with gradient overlay */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Unicorn image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1513682121497-80211f36a7d3?auto=format&fit=crop&w=1600&q=80')",
            clipPath: `inset(${100 - revealPercentage}% 0 0 0)`,
            opacity: 0.3
          }}
        />
        {/* Progress overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent to-pink-100/50"
          style={{
            clipPath: `inset(${100 - revealPercentage}% 0 0 0)`
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="relative mb-8">
          <div className="text-center">
            <h2 className="text-6xl mb-4 font-bold text-purple-600">
              {gameWords[currentStep].hebrew}
            </h2>
            
            {showAnimation && (
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Multiple animated icons */}
                <div className="relative">
                  <AnimationIcon className={`w-16 h-16 ${currentAnimation.color} ${currentAnimation.animation}`} />
                  {/* Additional floating animations */}
                  <div className="absolute -top-8 -left-8">
                    <AnimationIcon className={`w-8 h-8 ${currentAnimation.color} ${currentAnimation.animation}`} />
                  </div>
                  <div className="absolute -bottom-8 -right-8">
                    <AnimationIcon className={`w-8 h-8 ${currentAnimation.color} ${currentAnimation.animation}`} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="p-4 text-lg rounded-xl transition-all transform hover:scale-105
                       bg-gradient-to-r from-pink-500 to-purple-500 text-white
                       shadow-lg hover:shadow-xl disabled:opacity-50"
              disabled={showAnimation}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Step {currentStep + 1} of {totalSteps}
          </p>
          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
            <div 
              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${revealPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;