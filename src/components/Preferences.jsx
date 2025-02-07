import React, { useState } from "react";
import {words as defaultWords} from "../data/words.js"; 

const loadFromStorage = (key, defaultValue) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : defaultValue;
};

export const RetrieveConfig = () => ({
  words: loadFromStorage("searchWords", ["unicorn"]),
  steps: loadFromStorage("steps", 5),
  words: loadFromStorage("words", defaultWords)
});

export const ConfigModal = ({ isOpen, onClose, onSave }) => {

  if (!isOpen) return null; // Don't render when modal is closed

  const [searchWords, setSearchWords] = useState(() => loadFromStorage("searchWords", ["unicorn"]));
  const [steps, setSteps] = useState(() => loadFromStorage("steps", 5));
  const [words, setWords] = useState(() => loadFromStorage("words", defaultWords));

  // const [searchWords, setSearchWords] = useState(["unicorn"]);
  // const [steps, setSteps] = useState(5);
  // const [words, setWords] = useState(Array(5).fill({ question: "", correct: "", related: "", other1: "", other2: "" }));


  // Update search words dynamically
  const handleSearchWordChange = (index, value) => {
    const updatedWords = [...searchWords];
    updatedWords[index] = value;
    setSearchWords(updatedWords);
  };
  const addSearchWord = () => setSearchWords([...searchWords, ""]);
  const removeSearchWord = (index) => setSearchWords(searchWords.filter((_, i) => i !== index));

  // Adjust number of steps
  const handleStepsChange = (value) => {
    const stepValue = Math.max(5, Math.min(15, value));
    setSteps(stepValue);
  };

  // Update word and translations
  const handleWordChange = (index, property, value) => {
    const updatedWords = [...words];
    updatedWords[index][property] = value;
    setWords(updatedWords);
  };

  // Add a new word entry
  const addWord = () => {
    setWords([...words, { question: "", correct: "", related: "" }]);
  };

  // Remove a word entry
  const removeWord = (index) => {
    setWords(words.filter((_, i) => i !== index));
  };
  // const handleOptionChange = (wordIndex, optionIndex, value) => {
  //   const updatedWords = [...words];
  //   updatedWords[wordIndex].options[optionIndex] = value;
  //   setWords(updatedWords);
  // };

  //handleWordChange(wordIndex, 'related', e.target.value)}

  // Save the configuration and close the modal
  const handleSave = () => {
    localStorage.setItem("searchWords", JSON.stringify(searchWords));
    localStorage.setItem("steps", JSON.stringify(steps));
    localStorage.setItem("words", JSON.stringify(words));
    onSave({ searchWords, steps, words });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Game Configuration</h2>

        {/* Search Words Input */}
        <div className="mb-4">
          <label className="font-semibold block mb-2">Search Words for Photos</label>
          {searchWords.map((word, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={word}
                onChange={(e) => handleSearchWordChange(index, e.target.value)}
                className="border-2 p-2 flex-1 rounded-md"
              />
              {searchWords.length > 1 && (
                <button onClick={() => removeSearchWord(index)} className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md">
                  ✖
                </button>
              )}
            </div>
          ))}
          { searchWords.every(w => w.length > 0) &&
            <button onClick={addSearchWord} 
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md">
              + Add Word
            </button>
          }
        </div>

        {/* Step Selection */}
        <div className="mb-4">
          <label className="font-semibold block mb-2">Number of Steps (5-15)</label>
          <input
            type="number"
            min="5"
            max="15"
            value={steps}
            onChange={(e) => handleStepsChange(parseInt(e.target.value, 10))}
            className="border-2 p-2 rounded-md w-full"
          />
        </div>

        {/* Words & Translations */}
        <label className="font-semibold block mb-2">Words & Translations</label>
        <div className="mb-4 max-h-64 overflow-y-auto pr-4">
          {words.map((wordItem, wordIndex) => (                        
            <div key={wordIndex} className="mb-4 p-3 border-4 rounded-lg">

              <input //Question
                type="text"
                value={wordItem.question} //question: "", correct: "", related: "", other1: "", other2: "" }));
                onChange={(e) => handleWordChange(wordIndex, 'question', e.target.value)}
                placeholder={`Question Word ${wordIndex + 1}`}
                className="border-2 p-2 rounded-md w-full mb-2"
              />
              <input //Correct Answers
                type="text"
                value={wordItem.correct}
                onChange={(e) => handleWordChange(wordIndex, 'correct', e.target.value)}
                placeholder={`Correct Answer ${wordIndex + 1}`}
                className="border-2 p-2 rounded-md w-full mb-1"
              />
              <input //Related Answer
                type="text"
                value={wordItem.related}
                onChange={(e) => handleWordChange(wordIndex, 'related', e.target.value)}
                placeholder={`Related Answer ${wordIndex + 1}`}
                className="border-2 p-2 rounded-md w-full mb-1"
              />
              <button
                  onClick={() => removeWord(wordIndex)}
                  className="border-2 p-2 rounded-md w-full mb-1">  
              ✖ Remove Entry </button>

            </div>
          ))}
        </div>

        {/* Add Word Button */}
        <button onClick={addWord} className="w-full bg-blue-500 text-white p-2 rounded-md font-semibold hover:bg-blue-600">
          + Add Entry
        </button>

        {/* Buttons */}
        <div className="flex justify-center pt-4 space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded-md">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded-md">Save</button>
        </div>
      </div>
    </div>
  );
};

// Component to Open and Use the Modal
const ConfigScreen = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [config, setConfig] = useState(null);

  const handleSaveConfig = (newConfig) => {
    setConfig(newConfig);
    console.log("Saved Config:", newConfig);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Game Setup</h1>
      <button onClick={() => setModalOpen(true)} className="px-6 py-2 bg-blue-500 text-white rounded-md">
        Configure Game
      </button>

      {/* Display Config Summary */}
      {config && (
        <div className="mt-6 bg-white p-4 shadow rounded-md">
          <h3 className="text-xl font-semibold mb-2">Current Configuration:</h3>
          <p><strong>Search Words:</strong> {config.searchWords.join(", ")}</p>
          <p><strong>Steps:</strong> {config.steps}</p>
          <h4 className="font-semibold mt-2">Words & Translations:</h4>
          <ul>
            {config.words.map((w, i) => (
              <li key={i} className="text-gray-700">
                {w.word}: {w.options.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Render Modal When Open */}
      <ConfigModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSave={handleSaveConfig} />
    </div>
  );
};

export default ConfigScreen;
