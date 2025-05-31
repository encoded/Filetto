import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { CLIENT_TO_SERVER, SERVER_TO_CLIENT } from '@shared/messages';
import { useNavigation } from '@react-navigation/native';
import { useClient } from '@src/context/ClientContext';
import { useOrientation } from '@src/context/OrientationContext';
import { NAVIGATION, APP_ROOT } from '@src/config/ConfigNavigation';
import LayoutScreen from './LayoutScreen';
import DefaultButton from '@src/components/buttons/DefaultButton';
import TextInputBase from '@src/components/base/TextInputBase';
import TextBase from '@src/components/base/TextBase';
import * as Clipboard from 'expo-clipboard';

import ImageHost from "@assets/images/temp_host.jpg"
import ImageJoin from "@assets/images/temp_join.png"
import ImageButton from '@src/components/buttons/ImageButton';

export default function JoinLocalScreen() {
  const { sendMessage, addMessageListener } = useClient();
  const { isLandscape } = useOrientation();
  const [isHosting, setIsHosting] = useState(null);
  const [roomCode, setRoomCode] = useState('');
  const [link, setLink] = useState('');
  const [code, setCode] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = addMessageListener((data) => {
      if (data.type === SERVER_TO_CLIENT.ROOM_CREATED) {
        const newLink = `${APP_ROOT}/join-from-link?room=${data.roomName}`;
        setCode(data.roomName);
        setLink(newLink);
      }
    });

    return unsubscribe;
  }, []);

  const handleHost = () => {
    sendMessage({ type: CLIENT_TO_SERVER.CREATE_LOCAL_ROOM });
    setIsHosting(true);
  };

  const handleJoin = () => {
    sendMessage({ type: CLIENT_TO_SERVER.JOIN_ROOM, roomName: roomCode });
    navigation.navigate(NAVIGATION.SCREENS.JOIN);
  };

  return (
    <LayoutScreen>
      {isHosting === null && (
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
          <ImageButton image={ImageHost} onPress={handleHost}>
            <TextBase style={{fontSize: 60}}>Host a Game</TextBase>
          </ImageButton>
          <ImageButton image={ImageJoin} onPress={() => setIsHosting(false)}>
            <TextBase style={{fontSize: 60}}>Join a Game</TextBase>
          </ImageButton>
        </View>
      )}

      {isHosting === true && (
        <View style={styles.hostContainer}>
          <TextBase style={styles.label}>Share this code with friends:</TextBase>
          <TextBase style={styles.code}>{code || 'Waiting for code...'}</TextBase>
          {link !== '' && (
          <> 
            <View style={styles.qrContainer}>
              <QRCode value={link} size={200} />
            </View>
            <DefaultButton text="Copy Link" onPress={() => Clipboard.setStringAsync(link)} />
          </> 
          )}
        </View>
      )}

      {isHosting === false && (
        <View>
          <TextInputBase
            style={styles.input}
            placeholder="Enter Room Code"
            value={roomCode}
            onChangeText={setRoomCode}
          />
          <DefaultButton text="Join Game" onPress={handleJoin} />
        </View>
      )}
    </LayoutScreen>
  );
}

const styles = StyleSheet.create({
  hostContainer: {
    alignItems: 'center',
    rowGap: 20,
  },
  label: { 
    marginTop: 20, 
    fontSize: 16 },
  code: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginVertical: 10 },
  qrContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  input: { 
    borderWidth: 1, 
    padding: 8, 
    marginVertical: 10 
  },
});
