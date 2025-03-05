import React, { useState, useEffect } from "react";

const PlayerSelection2 = () => {
  const [players, setPlayers] = useState(['Alice', 'Bob', 'Charlie']);
  const [selectedPlayer, setSelectedPlayer] = useState({playerName: '', isNewPlayer: false});

  const handleAddPlayer = () => {
    const newPlayer = selectedPlayer?.playerName;
    if (newPlayer && !players.includes(newPlayer)) {
      setPlayers([...players, newPlayer]);
    }
  };

  const handleDeletePlayer = () => {
    if (selectedPlayer && !selectedPlayer.isNewPlayer) {
      setPlayers(players.filter((player) => player !== selectedPlayer.playerName));
    }
  }  

  const handlePlayerChange = (e) => {
    const value = e.target.value;
    setSelectedPlayer({playerName: value, isNewPlayer: !players.includes(value)});
  };

  useEffect(() => {
    console.log("New player list: ", players);
    const player = players[0] || "N/A";
    document.getElementById("player-select").value = player; // Manually clear input
    setSelectedPlayer(() => {
      return {playerName: player, isNewPlayer: false}
    });
  }, [players]);

  const handleMouseDown = (e) => {
    document.getElementById("player-select").value = ""; // Manually clear input
    setSelectedPlayer(""); // Still update React state
  };

  return (
    <div className="border border-gray-400 p-4 rounded-md mt-4">
      <div className="flex items-center space-x-2 mb-4">
        <label htmlFor="player-select">Player Name:</label>
        <input
          list="players-list"
          id="player-select"
          Value={selectedPlayer.playerName}
          onChange={handlePlayerChange}
          onMouseDown={handleMouseDown} 
          className="border border-gray-400 rounded-md pl-2"
        />
        <datalist id="players-list">
          {players.map((player, index) => (
            <option key={index} value={player}>{player}</option>
          ))}
        </datalist>
        {selectedPlayer.playerName && selectedPlayer.isNewPlayer &&
        <button className="px-3 py-1 bg-blue-500 text-white rounded-md" onClick={handleAddPlayer}>Add Player</button>}
        {selectedPlayer.playerName && !selectedPlayer.isNewPlayer &&
        <button className="px-3 py-1 bg-blue-500 text-white rounded-md" onClick={handleDeletePlayer}>Delete Player</button>}
      </div>
    </div>
  );
};

export default PlayerSelection2;