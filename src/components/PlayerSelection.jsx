import React, { useState, useEffect } from "react";

const PlayerSelection = ({selectedPlayerName, updateSelectedPlayerName}) => {
  const [players, setPlayers] = useState(['Shira', 'Adam']);
  const [selectedPlayer, setSelectedPlayer] = useState({selectedPlayer: players.length > 0 ? players[0] : '', isNewPlayer: false}); 

  function setSelectedPlayerWorkaround (player, isNewPlayer=false) {
    document.getElementById("player-select").value = player; // Manually workaround to datalist oddities 
    setSelectedPlayer((prev) => {return {playerName: player, isNewPlayer: isNewPlayer}});
    updateSelectedPlayerName(player);
  }

  const handleAddPlayer = () => {
    const newPlayer = selectedPlayer?.playerName;
    if (newPlayer && !players.includes(newPlayer)) {
      setPlayers([...players, newPlayer]);
      setSelectedPlayerWorkaround(newPlayer, false);
    }
  };

  const handleDeletePlayer = () => {
    if (selectedPlayer && !selectedPlayer.isNewPlayer) {
      setPlayers(players.filter((player) => player !== selectedPlayer.playerName));
      setSelectedPlayerWorkaround(players.length > 0 ? players[0] : ''  , false);
    }
  }  

  const handlePlayerChange = (e) => {
    const playerName = e.target.value;
    setSelectedPlayerWorkaround(playerName, !players.includes(playerName));
  };

  const handleMouseDown = (e) => {
    setSelectedPlayerWorkaround('', false);
  };

  useEffect(() => {
    console.log("useEff", selectedPlayerName);
    setSelectedPlayerWorkaround(selectedPlayerName, false);
  }, []);

  return (
    <div className="border border-gray-400 p-4 rounded-md mt-4">
      <div className="flex items-center space-x-2 mb-4">
        <label htmlFor="player-select">Player Name:</label>
        <input
          list="players-list"
          id="player-select"
          value={selectedPlayer?.playerName ?? "SP is N/A"}
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

export default PlayerSelection;