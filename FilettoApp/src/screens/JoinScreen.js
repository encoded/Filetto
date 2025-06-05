import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LayoutScreen from './LayoutScreen';
import DefaultButton from '@src/components/buttons/DefaultButton';
import TextBase from '@src/components/base/TextBase';
import TextInputBase from '@src/components/base/TextInputBase';
import { useClient } from '@src/context/ClientContext';
import { useGame } from '@src/context/GameContext';
import { CLIENT_TO_SERVER, SERVER_TO_CLIENT, SERVER_TO_ALL } from '@shared/messages';
import { NAVIGATION } from '@config/ConfigNavigation';
import cardStyles from '@src/styles/cardStyles';

export default function JoinScreen({ navigation, route }) {
  const { connectToHost, addMessageListener, sendMessage } = useClient();
  const { isJoined } = useGame();
  const [inputName, setInputName] = useState('');
  const [waitingForName, setWaitingForName] = useState(false);
  const roomCode = route.params?.roomCode;
  const isOwner = route.params?.isOwner;
  const mode = route.params?.mode || 'player';

  useEffect(() => {
    const unsubscribe = addMessageListener((data) => {
      switch (data.type) {
        case SERVER_TO_CLIENT.WAITING_FOR_NAME:
          setWaitingForName(true);
          break;
        case SERVER_TO_CLIENT.JOIN_SUCCESS:
          // Navigate to RoomScreen for both owners and players
          navigation.replace(NAVIGATION.SCREENS.ROOM);
          break;
      }
    });

    // Enter room immediately if we have a code
    if (roomCode) {
      sendMessage({ 
        type: CLIENT_TO_SERVER.ENTER_ROOM,
        roomName: roomCode
      });
    }

    return unsubscribe;
  }, [roomCode, isOwner, mode]);

  const handleSubmitName = () => {
    if (!inputName.trim()) return;

    sendMessage({ 
      type: CLIENT_TO_SERVER.JOIN,
      name: inputName.trim()
    });
  };

  if (!waitingForName) {
    return (
      <LayoutScreen>
        <View style={cardStyles.card}>
          <TextBase style={styles.text}>
            {isOwner 
              ? 'Creating your room...'
              : roomCode 
                ? 'Joining room...' 
                : 'Waiting for another player to join...'}
          </TextBase>
        </View>
      </LayoutScreen>
    );
  }

  return (
    <LayoutScreen>
      <View style={cardStyles.card}>
        <TextBase style={cardStyles.title}>
          {isOwner ? 'Create Your Profile' : 'Join Game'}
        </TextBase>
        <TextBase style={cardStyles.description}>
          {isOwner 
            ? 'Enter your name to create the room.'
            : 'Enter your name to join the game.'}
        </TextBase>
        <View style={styles.inputContainer}>
          <TextInputBase
            style={styles.inputText}
            placeholder="Your name"
            value={inputName}
            onChangeText={setInputName}
          />
          <DefaultButton 
            text={isOwner ? "Create" : "Join"} 
            onPress={handleSubmitName} 
            disabled={!inputName.trim()} 
          />
        </View>
      </View>
    </LayoutScreen>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
  },
  inputText: {
    marginTop: 8,
    marginBottom: 20,
    width: '100%',
  },
  text: {
    fontSize: 18,
    textAlign: 'center'
  }
});
