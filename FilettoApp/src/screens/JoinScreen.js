import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LayoutScreen from './LayoutScreen';
import DefaultButton from '@src/components/buttons/DefaultButton';
import TextBase from '@src/components/base/TextBase';
import TextInputBase from '@src/components/base/TextInputBase';
import { useClient } from '@src/context/ClientContext';
import { useGame } from '@src/context/GameContext';
import { CLIENT_TO_SERVER, SERVER_TO_ALL } from '@shared/messages';
import { NAVIGATION } from '@config/ConfigNavigation';

export default function JoinScreen({ navigation }) {
  const { connectToHost, addMessageListener, sendMessage } = useClient();
  const { isJoined } = useGame();
  const [inputName, setInputName] = useState('');

  useEffect(() => {
    const unsubscribe = addMessageListener((data) => {
      if (data.type === SERVER_TO_ALL.GAME_START) {
        navigation.navigate(NAVIGATION.SCREENS.GAME, {
          board: data.board,
          currentTurn: data.currentTurn
        });
      }
    });

    return unsubscribe;
  }, []);

  const handleJoin = () => {
    sendMessage({ type: CLIENT_TO_SERVER.JOIN, name: inputName });
  };

  return (
    <LayoutScreen>
      {!isJoined ? (
        <View style={styles.inputContainer}>
          <TextBase>Enter your name:</TextBase>
          <TextInputBase
            style={styles.inputText}
            placeholder="Your name"
            value={inputName}
            onChangeText={setInputName}
          />
          <DefaultButton text="Join" onPress={handleJoin} disabled={!inputName.trim()} />
        </View>
      ) : (
        <TextBase style={styles.text}>
          Waiting for another player to join and get ready...
        </TextBase>
      )}
    </LayoutScreen>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 24
  },
  inputText: {
    width: 250
  }
});
