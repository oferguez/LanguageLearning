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
    setWords((prevWords) => {
      const updatedWords = [...prevWords, { question: "", correct: "", related: "", other1: "", other2: "" }];
      
      // Scroll to the bottom after updating the words
      setTimeout(() => {
        const tableContainer = document.querySelector(".scrollable-table");
        if (tableContainer) {
          tableContainer.scrollTop = tableContainer.scrollHeight;
        }
      }, 0);

      return updatedWords;
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Game Configuration</h2>

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

        {/* Words Table (With Selection Column) */}
        <div className="scrollable-table overflow-y-scroll max-h-[300px] border border-gray-400 rounded-md">
          <table className="table-auto w-full border-collapse">
            <thead className="bg-gray-300 border border-gray-400">
              <tr>
                <th className="border border-gray-400 p-2">✔</th>
                <th className="border border-gray-400 p-2">Question</th>
                <th className="border border-gray-400 p-2">Correct</th>
                <th className="border border-gray-400 p-2">Related</th>
                <th className="border border-gray-400 p-2">Other 1</th>
                <th className="border border-gray-400 p-2">Other 2</th>
              </tr>
            </thead>
            <tbody>
              {words.map((word, index) => (
                <tr key={index} className="hover:bg-gray-100 border border-gray-400">
                  {/* Selection Checkbox */}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Use AI Button */}
        <button
          onClick={() => console.log("Use AI called")}
          className="w-full mt-4 bg-purple-500 text-white p-2 rounded-md font-semibold"
        >
          Use AI
        </button>

        {/* Save and Cancel Buttons */}
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              localStorage.setItem("searchWords", JSON.stringify(searchWords));
              localStorage.setItem("steps", steps);
              localStorage.setItem("words", JSON.stringify(words));
              onSave({ searchWords, steps, words });
              onClose();
            }}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
