import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LayoutScreen from './LayoutScreen';
import TextBase from '@src/components/base/TextBase';
import { NAVIGATION } from '@config/ConfigNavigation';
import { useOrientation } from '@src/context/OrientationContext';
import { useClient } from '@src/context/ClientContext';
import ButtonBase from '@src/components/base/ButtonBase';

import HostIcon from "@assets/icons/host.svg";
import GameIcon from "@assets/icons/game.svg";
import TextInputBase from '@src/components/base/TextInputBase';

import COLORS from '@src/config/ConfigColors';
import { CLIENT_TO_SERVER } from '@shared/messages'
import HoverableButton from '@src/components/base/HoverableButton';

export default function MenuScreen({ navigation }) {
  const { isLandscape } = useOrientation();
  const { sendMessage} = useClient();
  const [roomName, setRoomName] = useState('');

  const handleJoinRoom = () => {
    if (roomName.trim()) {
      sendMessage({ type: CLIENT_TO_SERVER.JOIN_ROOM, roomName: roomName.trim() });
      navigation.navigate(NAVIGATION.SCREENS.JOIN);
    }
  };

  const handlePlayLocal = () => {
    navigation.navigate(NAVIGATION.SCREENS.CREATE_ROOM);
  };

  const handlePlayOnline = () => {
    navigation.navigate(NAVIGATION.SCREENS.FIND_ROOM);
  };

  return (
    <LayoutScreen>
      <View
        style={[
          styles.container,
          { flexDirection: isLandscape ? 'row' : 'column' },
        ]}
      >
        <HoverableButton onPress={handlePlayLocal} style={styles.card}>
          <HostIcon/>
          <TextBase style={styles.title}>Create a room</TextBase>
          <TextBase style={styles.description}>
            Play locally with other players in the same room. One device acts as the host and shows the game, while each player connects with their phone to use as a controller.
          </TextBase>
        </HoverableButton>

        <HoverableButton onPress={handlePlayOnline} style={styles.card}>
          <GameIcon/>
          <TextBase style={styles.title}>Find a random room</TextBase>
          <TextBase style={styles.description}>
            Play online with other players remotely. Everyone joins the game directly from their own device — no host needed, and you can play from anywhere.
          </TextBase>
        </HoverableButton>
      </View>
      <View style={styles.joinContainer}>
        <TextBase style={styles.joinTitle}>Join a pre-existing game room</TextBase>
        
        <View style={styles.inputContainer}>
          <TextInputBase
            style={styles.input}
            placeholder="Write the room ID here"
            value={roomName}
            onChangeText={setRoomName}
          />
          <ButtonBase style={[styles.button, {backgroundColor: COLORS.special}]} onPress={handleJoinRoom}>
            <Text style={styles.buttonText}>GO</Text>
          </ButtonBase>
        </View>
      
    </View>
    </LayoutScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 48,
    width: '100%',
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 300,
    height: 200,
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: "#000"
  },
  description: {
    fontSize: 12,
    textAlign: 'center',
    color: "#000"
  },
  joinContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  joinTitle: {
    fontSize: 14,
    marginTop: 48,
    marginBottom: 16,
    fontWeight: "bold"
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginRight: 100,
    backgroundColor: "#fff",
    color: "#000"
  },
  button: {
    width: 70,
    height: 50,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    position: "absolute",
    borderColor: "#000",
    right: 0,
    borderWidth: 2,
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold"
  },
});
