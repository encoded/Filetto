import React, { createContext, useContext, useEffect, useState } from 'react';
import { useClient } from './ClientContext';
import { CLIENT_TO_SERVER, SERVER_TO_CLIENT, SERVER_TO_ALL } from '@shared/messages';

const GameContext = createContext();

export function GameProvider({ children }) {
  const { sendMessage, isConnected, addMessageListener } = useClient();

  const [isJoined, setIsJoined] = useState(false);
  const [gameReady, setGameReady] = useState(false);
  const [players, setPlayers] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [playMode, setPlayMode] = useState(null);
  const [settings, setSettings] = useState({});
  const [playerId, setPlayerId] = useState(null); // id of this player
  const [roomName, setRoomName] = useState(null);

  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = addMessageListener((data) => {
      switch (data.type) {
        case SERVER_TO_CLIENT.JOIN_SUCCESS:
          setIsJoined(true);
          setPlayerId(data.playerId);
          setIsOwner(data.isOwner);
          setPlayMode(data.mode);
          setSettings(data.settings);
          setRoomName(data.roomName);
          sendMessage({ type: CLIENT_TO_SERVER.READY });
          break;

        case SERVER_TO_CLIENT.ROOM_CREATED:
          setIsJoined(true);
          setIsOwner(data.isOwner);
          setPlayMode(data.mode);
          setRoomName(data.roomName);
          break;

        case SERVER_TO_ALL.READY_STATUS:
          setGameReady(data.players.every(player => player.ready));
          setPlayers(data.players);
          setSettings(data.settings);
          break;

        case SERVER_TO_ALL.PLAYER_LEFT:
          if (data.isOwner) {
            setIsOwner(true);
          }
          break;

        case SERVER_TO_ALL.GAME_END:
          setGameReady(false);
          break;

        default:
          break;
      }
    });

    return unsubscribe;
  }, [isConnected, sendMessage, addMessageListener]);

  const updateSettings = (newSettings) => {
    if (!isOwner) return;
    sendMessage({ 
      type: CLIENT_TO_SERVER.UPDATE_SETTINGS,
      settings: newSettings
    });
  };

  return (
    <GameContext.Provider value={{ 
      isJoined, 
      playerId,
      players,
      gameReady,
      isOwner,
      playMode,
      settings,
      updateSettings,
      roomName
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
