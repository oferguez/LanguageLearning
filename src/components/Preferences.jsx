import React, { useState, useEffect } from "react";
import fetchTranslatedWords from "../service/translationAiFetcher.js";
import ProgressBar from "./ProgressBar.jsx";
import fetchCSV from '../service/defaultWords.js';
//import '../Preferences.css';

const chunkSize = 2;

function isValidObject(obj) {
  if (obj === undefined) {
    return false;
  }
  if (obj === null) {
    return false;
  }

  if (typeof obj === "object") {
    return Object.keys(obj).length > 0;
  }

  if (Array.isArray(obj)) {
    return obj.length > 0;
  }

  return true;
}

const loadFromStorage = (key, defaultValue) => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (error) {
    console.error(`Error loading from storage: ${key}`, error);
    return defaultValue;
  }
};

export const SaveConfig = ({ searchWords, steps, words }) => {
  localStorage.setItem("searchWords", JSON.stringify(searchWords));
  localStorage.setItem("steps", JSON.stringify(steps));
  localStorage.setItem("words", JSON.stringify(words));
}

export const RetrieveConfig = () => {
  console.log('RetrieveConfigAsync called');

  async function loadCsvAsync() {
    const csvFilePath = `${import.meta.env.BASE_URL}words.csv`;
    const data = await fetchCSV(csvFilePath)
      .catch(error => console.error("Error loading CSV:", error));
    console.log(`fetched ${data.length} words from ${csvFilePath}`)
    return [...data];
  }

  return loadCsvAsync().then(words => { // Handle promise with .then()
    let r = {
      searchWords: loadFromStorage("searchWords", ["unicorn"]),
      steps: loadFromStorage("steps", 5),
      words: loadFromStorage("words", words) // Now words is resolved
    };
    console.log('RetrieveConfigAsync: loadCsvAsync completed');
    console.dir(r);
    return r;
  });
};

export const ConfigModal = ({ isOpen, onClose, onSave }) => {
  const [searchWords, setSearchWords] = useState(loadFromStorage("searchWords", ["unicorn"]));
  const [steps, setSteps] = useState(loadFromStorage("steps", 5));
  const [targetLanguage, setTargetLanguage] = useState("English (UK)");
  const [words, setWords] = useState(loadFromStorage("words", []));

  const [selectedWords, setSelectedWords] = useState(new Set());
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [translatedWords, setTranslatedWords] = useState(0);
  const [wordsTotal, setWordsTotal] = useState(0);
  const [players, setPlayers] = useState(['Alice', 'Bob', 'Charlie']);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [newPlayer, setNewPlayer] = useState('');

  async function loadCSV() {

    const csvFilePath = `${import.meta.env.BASE_URL}words.csv`;
    const data = await fetchCSV(csvFilePath)
      .catch(error => console.error("Error loading CSV:", error));
    return [...data];
  }

  useEffect(() => {
    async function iLoadCSV() {

      const csvFilePath = `${import.meta.env.BASE_URL}words.csv`;
      const data = await fetchCSV(csvFilePath)
        .catch(error => console.error("Error loading CSV:", error));
      if (data.length > 0) {
        setWords((prev) => {
          return [...data];
        })
      }
    }

    iLoadCSV();
    // if (!isValidObject(words)) {
    //   loadCSV();
    // }
  }, []);

  function onTranslationChunkReceived(wordsReceived, wordsTotal) {
    console.log(`Received ${wordsReceived} of ${wordsTotal} words`);
    setTranslatedWords(wordsReceived);
    setWordsTotal(wordsTotal);
  }


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

  const handleWordChanged = (e, index, key) => {
    setWords(prevWords => {
      const newValue = e.target.value;
      const updatedWords = [...prevWords];
      updatedWords[index] = { ...updatedWords[index], [key]: newValue };
      return updatedWords;
    });
  };

  const OnAiAutoSuggest = () => {
    const sources = Array.from(selectedWords).map((index) => words[index].question);
    setIsAiLoading(true);
    fetchTranslatedWords(sources, targetLanguage, onTranslationChunkReceived, chunkSize).then((translatedWords) => {
      setWords((prevWords) => {
        const updatedWords = [...prevWords];
        translatedWords.forEach((translatedWord, _) => {
          const targetWord = updatedWords.find(obj => obj.question === translatedWord.question);
          if (targetWord) {
            // Modify properties
            targetWord.correct = translatedWord.correct;
            targetWord.related = translatedWord.related;
            targetWord.other1 = translatedWord.other1;
            targetWord.other2 = translatedWord.other2;
          }
          else {
            updatedWords.push({
              question: translatedWord.question,
              correct: translatedWord.correct,
              related: translatedWord.related,
              other1: translatedWord.other1,
              other2: translatedWord.other2
            });
          }
        });
        return updatedWords;
      });
      setIsAiLoading(false);
    });
  };

  const deleteSelected = () => {
    setWords((prevWords) => {
      const updatedWords = prevWords.filter((_, i) => !selectedWords.has(i));
      setSelectedWords(new Set());
      return updatedWords;
    });
  }

  const handleAddPlayer = () => {
    if (newPlayer && !players.includes(newPlayer)) {
      setPlayers([...players, newPlayer]);
      setNewPlayer('');
    }
  };

  const handleDeletePlayer = (player) => {
    setPlayers(players.filter(p => p !== player));
  };

  return isOpen && (

<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
  <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
    <h2 className="text-2xl font-bold mb-4 text-center">Game Configuration</h2>

    {/* Player Name */}
    <div className="border border-gray-400 p-4 rounded-md mt-4">
      <div className="flex items-center space-x-2 mb-4">
        <label htmlFor="player-select">Player Name:</label>
        <select
          id="player-select"
          value={selectedPlayer}
          onChange={(e) => setSelectedPlayer(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="" disabled>Select a player</option>
          {players.map((player, index) => (
            <option key={index} value={player}>{player}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <button className="px-3 py-1 bg-blue-500 text-white rounded-md" onClick={() => handleDeletePlayer(selectedPlayer)}>Delete Player</button>
        <input
          type="text"
          value={newPlayer}
          onChange={(e) => setNewPlayer(e.target.value)}
          placeholder="New player name"
          className="px-3 py-1 border rounded-md"
        />
        <button className="px-3 py-1 bg-blue-500 text-white rounded-md" onClick={handleAddPlayer}>Add Player</button>
      </div>
    </div>

    {/* Search Words Section */}
    <div className="border border-gray-400 p-4 rounded-md mt-4">
      <label className="font-semibold block mb-2">Search Words</label>
      {isValidObject(searchWords) && searchWords.map((word, index) => (
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
    <div className="border border-gray-400 p-4 rounded-md mt-4">
      <label className="font-semibold mb-2">Number of Steps (5-15):</label>
      <input
        type="number"
        value={steps}
        onChange={(e) => setSteps(Math.max(5, Math.min(15, Number(e.target.value))))}
        className="border p-2 rounded-md"
      />
    </div>

    {/* Game words table */}
    <div className="border border-gray-400 p-4 rounded-md mt-4">
      {/* Button Row - Responsive Layout */}
      <div className="flex flex-col space-y-3 mb-4 sm:flex-row sm:flex-wrap sm:items-center sm:space-y-0 sm:space-x-2">
        {/* First Row on Mobile / Left Side on Desktop */}
        <div className="flex space-x-2">
          <button
            onClick={toggleSelectAll}
            className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm whitespace-nowrap"
          >
            {selectedWords.size === words.length ? "Deselect All" : "Select All"}
          </button>

          <button
            onClick={addNewWord}
            className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm whitespace-nowrap"
          >
            + Add Word
          </button>

          <button
            disabled={selectedWords.size === 0}
            onClick={deleteSelected}
            className={`px-3 py-1 text-white rounded-md text-sm whitespace-nowrap ${selectedWords.size === 0 ? "bg-gray-400" : "bg-blue-500"}`}
          >
            ✖ Delete
          </button>
        </div>

        {/* Second Row on Mobile / Middle on Desktop */}
        <div className="flex items-center space-x-2 sm:ml-1">
          <label htmlFor="targetLanguage" className="font-semibold text-sm whitespace-nowrap">
            Target Language:
          </label>
          <select
            id="targetLanguage"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="px-2 py-1 border rounded-md text-sm"
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

        {/* Third Row on Mobile / Right Side on Desktop */}
        <div className="sm:ml-auto">
          <button
            disabled={selectedWords.size === 0 || isAiLoading}
            onClick={() => OnAiAutoSuggest()}
            className={`w-full px-4 py-2 rounded-md text-white text-sm ${(isAiLoading || selectedWords.size === 0) ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
          >
            {isAiLoading ? "⏳ Processing..." : "AI Auto Suggest"}
          </button>
        </div>
      </div>

      {/* Progress Bar - Always Full Width */}
      <div>
        {isAiLoading && wordsTotal > chunkSize && <ProgressBar wordsReceived={translatedWords} wordsTotal={wordsTotal} />}
      </div>

      {/* Words Table */}
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
            {isValidObject(words) && words.map((word, index) => (
              <tr key={index} className="hover:bg-gray-100 border border-gray-400">
                <td className="border border-gray-400 p-2 text-center">
                  <input type="checkbox" checked={selectedWords.has(index)} onChange={() => toggleSelect(index)} />
                </td>
                {["question", "correct", "related", "other1", "other2"].map((key) => (
                  <td key={key} className="border border-gray-400 p-2">
                    <input type="text" value={word[key]} onChange={(e) => handleWordChanged(e, index, key)} className="w-full border rounded-md p-1" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Save and Cancel Buttons */}
      <div className="flex justify-end space-x-4 mt-4">
        <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500">Cancel</button>
        <button onClick={() => onSave({ searchWords, steps, words })} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Save</button>
      </div>
    </div>
  </div>
</div>  );
};