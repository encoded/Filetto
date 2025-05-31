import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MenuStack from '@src/navigation/MenuStack';
import { NetworkProvider } from '@src/context/NetworkContext';
import { ClientProvider } from '@src/context/ClientContext';
import { GameProvider } from '@src/context/GameContext';
import { OrientationProvider } from '@src/context/OrientationContext';
import { NAVIGATION, APP_ROOT } from '@src/config/ConfigNavigation';
import * as Linking from 'expo-linking';

const linking = {
  prefixes: [APP_ROOT, 'filetto://'],
  config: {
    screens: {
      MenuScreen: '',
      JoinFromLinkScreen: 'join-from-link',
      JoinLocalScreen: 'join-local',
      JoinOnlineScreen: 'join-online'
    },
  }
};

export default function App() {
  return (
    <SafeAreaProvider>
      <OrientationProvider>
        <NetworkProvider>
          <ClientProvider>
            <GameProvider>
              <NavigationContainer linking={linking}>
                <MenuStack/>
              </NavigationContainer>
            </GameProvider>
          </ClientProvider>
        </NetworkProvider>
      </OrientationProvider>
    </SafeAreaProvider>
  );
}
