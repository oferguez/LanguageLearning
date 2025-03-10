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
    <div className={`w-80 md:w-96 lg:w-[40rem] ${className}`}> {/* Set fixed width */}
        <label className="flex items-center justify-center" htmlFor="player-select">Player Name:</label>
        <input className="ml-4 pl-4 text-black border border-gray-300 
            hover:border-4 hover:border-green-500 focus:border-4 
            focus:border-blue-500 transition-all
            w-40 md:w-60 lg:w-72"
          list="players-list"
          id="player-select"
          style={{ width: "10rem" }}
          value= {isValidObject(selectedPlayer) ? selectedPlayer : "SP is N/A"}
          onChange={handlePlayerChange}
          onMouseDown={handleMouseDown} 
        />
        <datalist id="players-list">
          {players.map((player, index) => (
            <option key={index} value={player}>{player}</option>
          ))}
        </datalist>

        <div className="
        
        w-80 md:w-96 lg:w-[rem]

        ml-4 min-w-[8rem] w-full max-w-[12rem]">
          {isValidObject(selectedPlayer) && !players.includes(selectedPlayer) && (
            <button  
              className="w-full px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:shadow-lg transition-all" 
              onClick={handleAddPlayer}
            >
              Add Player
            </button>
          )}

          {isValidObject(selectedPlayer) && players.includes(selectedPlayer) && (
            <button  
              className="w-full px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:shadow-lg transition-all" 
              onClick={handleDeletePlayer}
            >
              Delete Player
            </button>
          )}
      </div>


    </div>

  );
};

/*
<div className="ml-4 min-w-[8rem] w-full max-w-[12rem]">
  {isValidObject(selectedPlayer) && !players.includes(selectedPlayer) && (
    <button  
      className="w-full px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:shadow-lg transition-all" 
      onClick={handleAddPlayer}
    >
      Add Player
    </button>
  )}

  {isValidObject(selectedPlayer) && players.includes(selectedPlayer) && (
    <button  
      className="w-full px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:shadow-lg transition-all" 
      onClick={handleDeletePlayer}
    >
      Delete Player
    </button>
  )}
</div>

*/