import React, { useState, useEffect } from 'react';
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
import { CLIENT_TO_SERVER, SERVER_TO_CLIENT } from '@shared/messages'
import HoverableButton from '@src/components/base/HoverableButton';

export default function MenuScreen({ navigation }) {
  const { isLandscape } = useOrientation();
  const { sendMessage, addMessageListener } = useClient();
  const [roomName, setRoomName] = useState('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const unsubscribe = addMessageListener((data) => {
      if (data.type === SERVER_TO_CLIENT.ROOM_FOUND) {
        if (!data.found) {
          setShowError(true);
        } else {
          navigation.navigate(NAVIGATION.SCREENS.JOIN);
        }
      }
    });

    return unsubscribe;
  }, []);

  const handleJoinRoom = () => {
    if (roomName.trim()) {
      setShowError(false);  // Clear any previous error
      sendMessage({ type: CLIENT_TO_SERVER.ENTER_ROOM, roomName: roomName.trim() });
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
            onFocus={() => {
              setRoomName('');
              setShowError(false);
            }}
            onChangeText={(text) => {
              setRoomName(text);
            }}
          />
          <ButtonBase style={[styles.button, {backgroundColor: COLORS.special}]} onPress={handleJoinRoom}>
            <Text style={styles.buttonText}>GO</Text>
          </ButtonBase>
        </View>
        <TextBase style={[styles.errorMessage, {opacity: showError ? 1 : 0, color: COLORS.error}]}>
          Room not found
        </TextBase>
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
    fontWeight: "bold",
    color: COLORS.textSecondary
  },
  inputContainer: {
    marginBottom: 8,
    flexDirection: 'row',
    position: 'relative',
  },
  input: {
    height: 50,
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    paddingRight: 80,
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
  errorMessage: {
    color: COLORS.error,
    marginTop: 8,
    fontSize: 14
  }
});
