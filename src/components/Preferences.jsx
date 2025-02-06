import React, { useState } from "react";

export const ConfigModal = ({ isOpen, onClose, onSave }) => {
  const [searchWords, setSearchWords] = useState(["unicorn"]);
  const [steps, setSteps] = useState(5);
  const [words, setWords] = useState(Array(5).fill({ word: "", options: ["", "", "", ""] }));

  if (!isOpen) return null; // Don't render when modal is closed

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
    setWords(Array(stepValue).fill({ word: "", options: ["", "", "", ""] }));
  };

  // Update word and translations
  const handleWordChange = (index, value) => {
    const updatedWords = [...words];
    updatedWords[index].word = value;
    setWords(updatedWords);
  };

  const handleOptionChange = (wordIndex, optionIndex, value) => {
    const updatedWords = [...words];
    updatedWords[wordIndex].options[optionIndex] = value;
    setWords(updatedWords);
  };

  // Save the configuration and close the modal
  const handleSave = () => {
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
                className="border p-2 flex-1 rounded-md"
              />
              {searchWords.length > 1 && (
                <button onClick={() => removeSearchWord(index)} className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md">
                  ✖
                </button>
              )}
            </div>
          ))}
          <button onClick={addSearchWord} className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md">+ Add Word</button>
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
            className="border p-2 rounded-md w-full"
          />
        </div>

        {/* Words & Translations */}
        <div className="mb-4 max-h-64 overflow-y-auto">
          <label className="font-semibold block mb-2">Words & Translations</label>
          {words.map((wordItem, wordIndex) => (
            <div key={wordIndex} className="mb-4 p-3 border rounded-lg">
              <input
                type="text"
                value={wordItem.word}
                onChange={(e) => handleWordChange(wordIndex, e.target.value)}
                placeholder={`Word ${wordIndex + 1}`}
                className="border p-2 rounded-md w-full mb-2"
              />
              {wordItem.options.map((option, optionIndex) => (
                <input
                  key={optionIndex}
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(wordIndex, optionIndex, e.target.value)}
                  placeholder={`Option ${optionIndex + 1}`}
                  className="border p-2 rounded-md w-full mb-1"
                />
              ))}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
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
