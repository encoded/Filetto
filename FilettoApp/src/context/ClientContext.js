import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useNetwork } from '@src/context/NetworkContext';

import { CLIENT_TO_SERVER, SERVER_TO_CLIENT} from '@shared/messages'
import { sendMessageToServer } from '@src/utils/networkUtils';

export const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  const { ipAddress } = useNetwork();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const listenersRef = useRef([]);

  const addMessageListener = (callback) => {
    listenersRef.current.push(callback);
    return () => {
      listenersRef.current = listenersRef.current.filter(cb => cb !== callback);
    };
  };

  const connectToHost = () => {
    const ws = new WebSocket('wss://filetto.onrender.com');
    
    // To test with local server
    // const ws = new WebSocket('ws://192.168.0.87:3000');

    socketRef.current = ws;

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      console.log('Client - Received from server:', event.data);
      const data = JSON.parse(event.data);
      listenersRef.current.forEach(cb => cb(data));
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
    };
  };

  const sendMessage = (data) => {
    sendMessageToServer(socketRef.current, data);
  };

  return (
    <ClientContext.Provider
      value={{
        ipAddress,
        isConnected,
        connectToHost,
        addMessageListener,
        sendMessage
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

// Hook for easy use
export const useClient = () => useContext(ClientContext);
