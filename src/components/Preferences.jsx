import React, { useState } from "react";
import { words as defaultWords } from "../data/words.js";

// Load from localStorage or use defaults
const loadFromStorage = (key, defaultValue) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : defaultValue;
};

// Retrieve Config
export const RetrieveConfig = () => ({
  searchWords: loadFromStorage("searchWords", ["unicorn"]),
  steps: loadFromStorage("steps", 5),
  words: loadFromStorage("words", defaultWords),
});

// Modal Component
export const ConfigModal = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  const [searchWords, setSearchWords] = useState(() => loadFromStorage("searchWords", ["unicorn"]));
  const [steps, setSteps] = useState(() => loadFromStorage("steps", 5));
  const [words, setWords] = useState(() => loadFromStorage("words", defaultWords));

  // Handlers for updating searchWords
  const handleSearchWordChange = (index, value) => {
    const updatedWords = [...searchWords];
    updatedWords[index] = value;
    setSearchWords(updatedWords);
  };
  const addSearchWord = () => setSearchWords([...searchWords, ""]);
  const removeSearchWord = (index) => setSearchWords(searchWords.filter((_, i) => i !== index));

  // Steps handler
  const handleStepsChange = (value) => {
    const stepValue = Math.max(3, Math.min(15, value));
    setSteps(stepValue);
  };

  // Handlers for words
  const handleWordChange = (index, property, value) => {
    const updatedWords = [...words];
    updatedWords[index][property] = value;
    setWords(updatedWords);
  };

  // Add new word
  const addWord = () => {
    setWords([
      ...words,
      { question: "", correct: "", related: "", other1: "", other2: "" }, // Empty object structure
    ]);
  };

  const removeWord = (index) => {
    setWords(words.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    localStorage.setItem("searchWords", JSON.stringify(searchWords));
    localStorage.setItem("steps", JSON.stringify(steps));
    localStorage.setItem("words", JSON.stringify(words));
    onSave({ searchWords, steps, words });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Game Configuration</h2>

        {/* Search Words Section */}
        <div className="mb-4">
          <label className="font-semibold block mb-2">Search Words</label>
          {searchWords.map((word, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={word}
                onChange={(e) => handleSearchWordChange(index, e.target.value)}
                className="border p-2 flex-1 rounded-md"
              />
              {searchWords.length > 1 && (
                <button
                  onClick={() => removeSearchWord(index)}
                  className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md"
                >
                  ✖
                </button>
              )}
            </div>
          ))}
          <button onClick={addSearchWord} className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md">
            + Add Search Word
          </button>
        </div>

        {/* Steps Input */}
        <div className="mb-4">
          <label className="font-semibold block mb-2">Number of Steps (5-15)</label>
          <input
            type="number"
            value={steps}
            onChange={(e) => handleStepsChange(Number(e.target.value))}
            className="border p-2 rounded-md w-full"
          />
        </div>

        {/* Words Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Question</th>
                <th className="border p-2">Correct</th>
                <th className="border p-2">Related</th>
                <th className="border p-2">Other 1</th>
                <th className="border p-2">Other 2</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {words.map((word, index) => (
                <tr key={index}>
                  {["question", "correct", "related", "other1", "other2"].map((key) => (
                    <td key={key} className="border p-2">
                      <input
                        type="text"
                        value={word[key]}
                        onChange={(e) => handleWordChange(index, key, e.target.value)}
                        className="w-full border rounded-md p-1"
                      />
                    </td>
                  ))}
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => removeWord(index)}
                      className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      ✖
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Word Button */}
        <button
          onClick={addWord}
          className="w-full mt-4 bg-blue-500 text-white p-2 rounded-md font-semibold hover:bg-blue-600"
        >
          + Add Word
        </button>

        {/* Save and Cancel */}
        <div className="flex justify-end space-x-4 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded-md">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded-md">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};