import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useClient } from '@src/context/ClientContext';
import { useNavigation } from '@react-navigation/native';
import { CLIENT_TO_SERVER } from '@shared/messages';

import DefaultButton from '@src/components/buttons/DefaultButton';
import TextInputBase from '@src/components/base/TextInputBase';
import LayoutScreen from './LayoutScreen';

export default function LocalJoinGameScreen() {
  const { sendMessage } = useClient();
  const navigation = useNavigation();
  const [roomCode, setRoomCode] = useState('');

  const handleJoin = () => {
    sendMessage({ type: CLIENT_TO_SERVER.JOIN_ROOM, roomName: roomCode });
    navigation.navigate('Join'); // Adjust if needed
  };

  return (
    <LayoutScreen>
      <TextInputBase
        style={styles.input}
        placeholder="Enter Room Code"
        value={roomCode}
        onChangeText={setRoomCode}
      />
      <DefaultButton text="Join Game" onPress={handleJoin} />
    </LayoutScreen>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 8,
    marginVertical: 10,
    width: 250
  }
});
