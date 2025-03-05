import React, { useState } from 'react';

const PlayerSelection = () => {
  const [selectedPlayer, setSelectedPlayer] = useState('');

  const handlePlayerChange = (event) => {
    setSelectedPlayer(event.target.value);
  };

  const handlePlayerBlur = (event) => {
    // Optional: Add any additional logic when input loses focus
    console.log('Selected player:', event.target.value);
  };

  return (
    <div>
      <label htmlFor="player-select">Player Name:</label>
      <datalist id="players-list">
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Rick">Rick</option>
      </datalist>

      <input
        list="players-list"
        id="player-select"
        value={selectedPlayer}
        onChange={handlePlayerChange}
        onBlur={handlePlayerBlur}
        className="border p-2 rounded-md"
      />
    </div>
  );
};
export default PlayerSelection;