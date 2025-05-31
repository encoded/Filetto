import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import LayoutScreen from './LayoutScreen';
import DefaultButton from '@src/components/buttons/DefaultButton';
import TextBase from '@src/components/base/TextBase';
import { NAVIGATION } from '@config/ConfigNavigation';
import { useClient } from '@src/context/ClientContext';
import { useNetwork } from '@src/context/NetworkContext';
import { useOrientation } from '@src/context/OrientationContext';

import { CLIENT_TO_SERVER } from '@shared/messages'
import ImageButton from '@src/components/buttons/ImageButton';

import ImageLocal from "@assets/images/temp_local.png"
import ImageOnline from "@assets/images/temp_online.jpg"

export default function MenuScreen({ navigation }) {
  const { connectToHost, isConnected, sendMessage } = useClient();
  const { ipAddress } = useNetwork();
  const { isLandscape } = useOrientation();

  useEffect(() => {
    connectToHost(); // Connect to server
  }, []);

  const handlePlayLocal = () => {
    navigation.navigate(NAVIGATION.SCREENS.JOIN_LOCAL);
  };

  const handlePlayOnline = () => {
    navigation.navigate(NAVIGATION.SCREENS.JOIN_ONLINE);
  };

  return (
    <LayoutScreen>
      {!isConnected ? (
        <TextBase style={styles.text}>
          Waiting for server connection...{'\n'}This should take only a few seconds.
        </TextBase>
      ) : (
        <View
          style={{
            flex: 1,
            width: "100%",
            flexDirection: isLandscape ? 'row' : 'column',
            gap: 48,
            paddingVertical: isLandscape ? 30 : 40,
            paddingHorizontal: isLandscape ? 40 : 30,
          }}
        >
          <ImageButton
            image={ImageLocal}
            onPress={handlePlayLocal}
          >
            <TextBase style={{fontSize: 60}}>Play Local</TextBase>
          </ImageButton>

          <ImageButton
            image={ImageOnline}
            onPress={handlePlayOnline}
          >
            <TextBase style={{fontSize: 60}}>Play Online</TextBase>
          </ImageButton>
        </View>
      )}
    </LayoutScreen>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginVertical: 10,
  },
  text: {
    textAlign: 'center',
  },
});
