// src/screens/FindRoomScreen.js
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CLIENT_TO_SERVER, SERVER_TO_CLIENT } from '@shared/messages';
import { useClient } from '@src/context/ClientContext';
import TextBase from '@src/components/base/TextBase';
import LayoutScreen from './LayoutScreen';
import { NAVIGATION } from '@src/config/ConfigNavigation';
import COLORS from '@src/config/ConfigColors';

const FindRoomScreen = () => {
  const navigation = useNavigation();
  const { sendMessage, addMessageListener } = useClient();

  useEffect(() => {
    // Start searching immediately
    sendMessage({ type: CLIENT_TO_SERVER.FIND_RANDOM_ROOM });

    const unsubscribe = addMessageListener((data) => {
      if (data.type === SERVER_TO_CLIENT.ROOM_FOUND) {
        navigation.replace(NAVIGATION.SCREENS.JOIN, {
          roomCode: data.roomName
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <LayoutScreen>
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.special} />
        <TextBase style={styles.text}>Looking for other players...</TextBase>
      </View>
    </LayoutScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
    color: COLORS.textSecondary
  }
});

export default FindRoomScreen;
