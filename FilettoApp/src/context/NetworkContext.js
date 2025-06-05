import React, { createContext, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Network from 'expo-network';
import { getMarginBottom } from '@src/config/ConfigSpacing';

// Create the context
export const NetworkContext = createContext();

// Provider component
export const NetworkProvider = ({ children }) => {
  const [ipAddress, setIpAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const isDev = __DEV__; // This is a global variable in React Native that indicates dev mode

  useEffect(() => {
    const fetchNetworkInfo = async () => {
      try {
        const state = await Network.getNetworkStateAsync();
        setIsConnected(state.isConnected);

        if (state.isConnected) {
          const ip = await Network.getIpAddressAsync();
          setIpAddress(ip);
        }
      } catch (error) {
        console.error('Failed to fetch network info:', error);
      }
    };

    fetchNetworkInfo();
  }, []);

  return (
    <NetworkContext.Provider value={{ ipAddress, isConnected }}>
      {children}
      {/* Debug View */}
      {isDev && (
      <View style={[styles.debugContainer, { bottom: getMarginBottom(), left: getMarginBottom()}]}>
        <Text style={styles.debugText}>Connected: {isConnected ? 'Yes' : 'No'}</Text>
          <Text style={styles.debugText}>IP Address: {ipAddress || 'N/A'}</Text>
          <Text style={styles.debugText}>Environment: {isDev ? 'Development' : 'Production'}</Text>
        </View>
      )}
    </NetworkContext.Provider>
  );
};

const styles = StyleSheet.create({
  debugContainer: {
    position: 'absolute',
    backgroundColor: '#000000aa',
    padding: 8,
    borderRadius: 6,
  },
  debugText: {
    color: 'white',
    fontSize: 12,
  },
});

// Custom hook to use the network context
export const useNetwork = () => useContext(NetworkContext);