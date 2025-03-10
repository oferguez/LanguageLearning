import React, { useState, useEffect } from "react";
import { isValidObject } from "./Preferences";

export const getCurrentUser = () => 'Shira'

export const PlayerSelection = ({className, selectedPlayerName, updateSelectedPlayerName}) => {
  const [players, setPlayers] = useState(['Shira', 'Adam']);
  const [selectedPlayer, setSelectedPlayer] = useState(selectedPlayerName); 

  console.log('PS invoked')

  useEffect(() => {
    console.log(`ue1: PlayerSelection: selected=[${selectedPlayerName}] players=[${players}]`);
  }, []);

  useEffect(() => {
    console.log("ue2: ", selectedPlayerName);
    setSelectedPlayerWorkaround(selectedPlayerName, false);
  }, []);


  function setSelectedPlayerWorkaround (player) {
    document.getElementById("player-select").value = player; // Manually workaround to datalist oddities 
    setSelectedPlayer(player);
    updateSelectedPlayerName(player);
  }

  const handleAddPlayer = () => {
    const newPlayer = selectedPlayer;
    if (newPlayer && !players.includes(newPlayer)) {
      setPlayers([...players, newPlayer]);
      setSelectedPlayerWorkaround(newPlayer);
    }
  };

  const handleDeletePlayer = () => {
    if (selectedPlayer && players.includes(selectedPlayer)) {
      setPlayers(players.filter((player) => player !== selectedPlayer));
      setSelectedPlayerWorkaround(players.length > 0 ? players[0] : '');
    }
  }  

  const handlePlayerChange = (e) => {
    const playerName = e.target.value;
    setSelectedPlayerWorkaround(playerName);
  };

  const handleMouseDown = (e) => {
    setSelectedPlayerWorkaround('', false);
  };

return (
  <div className={`w-74 md:w-96 lg:w-[40rem] ${className}`}> {/* Smaller width on small screens */}
      <label className="flex items-center justify-center text-sm md:text-base" htmlFor="player-select">
          Player Name:
      </label>

      <input 
          className="ml-2 pl-2 text-black border border-gray-300 
                     hover:border-2 hover:border-green-500 focus:border-2 
                     focus:border-blue-500 transition-all
                     w-32 md:w-48 lg:w-60 text-sm md:text-base"
          list="players-list"
          id="player-select"
          value={isValidObject(selectedPlayer) ? selectedPlayer : "SP is N/A"}
          onChange={handlePlayerChange}
          onMouseDown={handleMouseDown} 
      />

      <datalist id="players-list">
        {players.map((player, index) => (
          <option key={index} value={player}>{player}</option>
        ))}
      </datalist>

      <div className="ml-2 min-w-[4rem] w-full
                      max-w-[10rem] text-sm md:text-base">
        {isValidObject(selectedPlayer) && !players.includes(selectedPlayer) && (
          <button  
            className={`${selectedPlayer.length === 0 ? 'cursor-not-allowed bg-gray-400' : ''} w-full px-4 py-2 text-white rounded-md `} 
            onClick={handleAddPlayer}
          >
            Add Player
          </button>
        )}

        {isValidObject(selectedPlayer) && players.includes(selectedPlayer) && (
          <button  
            className="w-full px-4 py-2 text-white rounded-md" 
            onClick={handleDeletePlayer}
          >
            Delete Player
          </button>
        )}
      </div>
  </div>
)};
