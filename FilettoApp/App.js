import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MenuStack from '@src/navigation/MenuStack';
import { NetworkProvider } from '@src/context/NetworkContext';
import { ClientProvider } from '@src/context/ClientContext';
import { GameProvider } from '@src/context/GameContext';
import { OrientationProvider } from '@src/context/OrientationContext';
import { NAVIGATION, APP_ROOT } from '@src/config/ConfigNavigation';

// const linking = {
//   prefixes: [APP_ROOT, 'filetto://'], //for testing on mobile add expo URL found when launching: such as exp://192.168.0.87:8082/--/ 
//   config: {
//     screens: {
//       [NAVIGATION.SCREENS.JOIN_FROM_LINK]: 'join-from-link'
//     },
//   },
// };

export default function App() {
  return (
    <SafeAreaProvider>
      <OrientationProvider>
        <NetworkProvider>
          <ClientProvider>
            <GameProvider>
              {/* <NavigationContainer linking={linking}> */}
              <NavigationContainer>
                <MenuStack/>
              </NavigationContainer>
            </GameProvider>
          </ClientProvider>
        </NetworkProvider>
      </OrientationProvider>
    </SafeAreaProvider>
  );
}
