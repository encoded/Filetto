import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MenuStack from '@src/navigation/MenuStack';
import { NetworkProvider } from '@src/context/NetworkContext';
import { ClientProvider } from '@src/context/ClientContext';
import { GameProvider } from '@src/context/GameContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <NetworkProvider>
        <ClientProvider>
          <GameProvider>
            <NavigationContainer>
              <MenuStack/>
            </NavigationContainer>
          </GameProvider>
        </ClientProvider>
      </NetworkProvider>
    </SafeAreaProvider>
  );
}
