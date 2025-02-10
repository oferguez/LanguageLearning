import React, { useState } from "react";
import { words as defaultWords } from "../data/words.js";

const loadFromStorage = (key, defaultValue) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : defaultValue;
};

export const RetrieveConfig = () => ({
  searchWords: loadFromStorage("searchWords", ["unicorn"]),
  steps: loadFromStorage("steps", 5),
  words: loadFromStorage("words", defaultWords),
});

export const ConfigModal = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  const [searchWords, setSearchWords] = useState(loadFromStorage("searchWords", ["unicorn"]));
  const [steps, setSteps] = useState(loadFromStorage("steps", 5));
  const [words, setWords] = useState(loadFromStorage("words", defaultWords));
  const [selectedWords, setSelectedWords] = useState(new Set());
  const [targetLanguage, setTargetLanguage] = useState("English (UK)");

  const toggleSelectAll = () => {
    if (selectedWords.size === words.length) {
      setSelectedWords(new Set());
    } else {
      setSelectedWords(new Set(words.map((_, i) => i)));
    }
  };

  const toggleSelect = (index) => {
    const newSelected = new Set(selectedWords);
    newSelected.has(index) ? newSelected.delete(index) : newSelected.add(index);
    setSelectedWords(newSelected);
  };

  const addNewWord = () => {
    setWords([...words, { question: "", correct: "", related: "", other1: "", other2: "" }]);
  };

  const fetchAIAnswers = async (index) => {
    const word = words[index];

    try {
      const response = await fetch("/api/gpt-answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: word.question,
          targetLanguage,
        }),
      });

      const data = await response.json();
      const updatedWords = [...words];
      updatedWords[index] = {
        ...updatedWords[index],
        correct: data.correct,
        related: data.related,
        other1: data.other1,
        other2: data.other2,
      };

      setWords(updatedWords);
    } catch (error) {
      console.error("Error fetching AI-generated answers:", error);
    }
  };

  const useAIForSelected = async () => {
    for (let index of selectedWords) {
      await fetchAIAnswers(index);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Game Configuration</h2>

        {/* Search Words Section */}
        <div className="mb-4">
          <label className="font-semibold block mb-2">Search Words</label>
          {searchWords.map((word, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={word}
                onChange={(e) => {
                  const updatedWords = [...searchWords];
                  updatedWords[index] = e.target.value;
                  setSearchWords(updatedWords);
                }}
                className="border p-2 flex-1 rounded-md"
              />
              {searchWords.length > 1 && (
                <button
                  onClick={() => setSearchWords(searchWords.filter((_, i) => i !== index))}
                  className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md"
                >
                  ✖
                </button>
              )}
            </div>
          ))}
          <button onClick={() => setSearchWords([...searchWords, ""])} className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md">
            + Add Search Word
          </button>
        </div>

        {/* Steps Input */}
        <div className="mb-4">
          <label className="font-semibold block mb-2">Number of Steps (5-15)</label>
          <input
            type="number"
            value={steps}
            onChange={(e) => setSteps(Math.max(3, Math.min(15, Number(e.target.value))))}
            className="border p-2 rounded-md w-full"
          />
        </div>

        {/* Button Row (Select All, Add Word, Target Language) */}
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={toggleSelectAll}
            className="px-3 py-1 bg-gray-500 text-white rounded-md"
          >
            {selectedWords.size === words.length ? "Deselect All" : "Select All"}
          </button>
          <button onClick={addNewWord} className="px-3 py-1 bg-blue-500 text-white rounded-md">
            + Add Word
          </button>
          <div className="flex items-center space-x-2">
            <label htmlFor="targetLanguage" className="font-semibold">
              Target Language:
            </label>
            <select
              id="targetLanguage"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="px-3 py-1 border rounded-md"
            >
              <option value="English (UK)">English (UK)</option>
              <option value="Hebrew">Hebrew</option>
              <option value="French">French</option>
              <option value="Spanish">Spanish</option>
              <option value="German">German</option>
              <option value="Italian">Italian</option>
              <option value="Chinese">Chinese</option>
            </select>
          </div>
        </div>

        {/* Words Table */}
        <div className="overflow-y-scroll max-h-[300px] border border-gray-400 rounded-md">
          <table className="table-auto w-full border-collapse">
            <thead className="bg-gray-300 border border-gray-400">
              <tr>
                <th className="border border-gray-400 p-2">✔</th>
                <th className="border border-gray-400 p-2">Question</th>
                <th className="border border-gray-400 p-2">Correct</th>
                <th className="border border-gray-400 p-2">Related</th>
                <th className="border border-gray-400 p-2">Other 1</th>
                <th className="border border-gray-400 p-2">Other 2</th>
                <th className="border border-gray-400 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {words.map((word, index) => (
                <tr key={index} className="hover:bg-gray-100 border border-gray-400">
                  <td className="border border-gray-400 p-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedWords.has(index)}
                      onChange={() => toggleSelect(index)}
                    />
                  </td>
                  {["question", "correct", "related", "other1", "other2"].map((key) => (
                    <td key={key} className="border border-gray-400 p-2">
                      <input
                        type="text"
                        value={word[key]}
                        onChange={(e) => {
                          const updated = [...words];
                          updated[index][key] = e.target.value;
                          setWords(updated);
                        }}
                        className="w-full border rounded-md p-1"
                      />
                    </td>
                  ))}
                  <td className="border border-gray-400 p-2 text-center">
                    <button
                      onClick={() => setWords(words.filter((_, i) => i !== index))}
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

        {/* Use AI Button */}
        <button onClick={useAIForSelected} className="w-full mt-4 bg-purple-500 text-white p-2 rounded-md font-semibold">
          Use AI
        </button>
      </div>
    </div>
  );
};
