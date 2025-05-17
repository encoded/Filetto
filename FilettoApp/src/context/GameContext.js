import React, { createContext, useContext, useEffect, useState } from 'react';
import { useClient } from './ClientContext';
import { CLIENT_TO_SERVER, SERVER_TO_CLIENT, SERVER_TO_ALL } from '@shared/messages';

const GameContext = createContext();

export function GameProvider({ children }) {
  const { sendMessage, isConnected, addMessageListener } = useClient();

  const [isJoined, setIsJoined] = useState(false);
  const [gameReady, setGameReady] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [players, setPlayers] = useState([]);
  const [opponentName, setOpponentName] = useState("Opponent");

  useEffect(() => {
    const name = players?.find(p => p.symbol !== playerSymbol)?.name;
    setOpponentName(name);
  }, [players]);

  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = addMessageListener((data) => {
      switch (data.type) {
        case SERVER_TO_CLIENT.JOIN_SUCCESS:
          setIsJoined(true);
          setPlayerSymbol(data.symbol); // ✅ use data from callback
          sendMessage({ type: CLIENT_TO_SERVER.READY });
          break;

        case SERVER_TO_ALL.READY_STATUS:
          setGameReady(data.players.every(player => player.ready));
          setPlayers(data.players);
          break;

        case SERVER_TO_ALL.PLAYER_LEFT:
          setIsJoined(false);
          setGameReady(false);
          setPlayerSymbol(null);
          setPlayers([]);
          break;

        default:
          break;
      }
    });

    return unsubscribe;
  }, [isConnected, sendMessage, addMessageListener]);

  return (
    <GameContext.Provider value={{ isJoined, playerSymbol, players, opponentName, gameReady }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
