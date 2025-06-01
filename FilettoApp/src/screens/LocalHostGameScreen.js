import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { CLIENT_TO_SERVER, SERVER_TO_CLIENT, SERVER_TO_ALL } from '@shared/messages';
import { useClient } from '@src/context/ClientContext';
import { useGame } from '@src/context/GameContext';
import TextBase from '@src/components/base/TextBase';
import DefaultButton from '@src/components/buttons/DefaultButton';

import { APP_ROOT, NAVIGATION } from '@src/config/ConfigNavigation';
import LayoutScreen from './LayoutScreen';
import COLORS from '@src/config/ConfigColors';
import { useNavigation } from '@react-navigation/native';
import { useOrientation } from '@src/context/OrientationContext';

export default function LocalHostGameScreen() {
  const navigation = useNavigation();
  const { isLandscape } = useOrientation();
  const { sendMessage, addMessageListener } = useClient();
  const { players, playerSymbol, opponentName } = useGame();
  const [code, setCode] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    const unsubscribe = addMessageListener((data) => {
      if (data.type === SERVER_TO_CLIENT.ROOM_CREATED) {
        const newLink = `${APP_ROOT}/join-from-link?room=${data.roomName}`;
        setCode(data.roomName);
        setLink(newLink);
      }
      else if (data.type === SERVER_TO_ALL.GAME_START) {
        navigation.navigate( NAVIGATION.SCREENS.HOST_GAME, {
          board: data.board,
          currentTurn: data.currentTurn
        });
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    sendMessage({ type: CLIENT_TO_SERVER.CREATE_LOCAL_ROOM });
  }, []);

  return (
    <LayoutScreen style={styles.hostContainer}>
      <View style={{flex: 1, alignItems: "center"}}>
        <View style={[styles.hostCard, {borderColor: COLORS.secondary}]}>
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
      </View>
      {isLandscape && (
        <View style={styles.playerListContainer}>
          <TextBase style={{ fontSize: 72 }}>PLAYERS</TextBase>
          <View>
            {players.length === 0 ? (
              <TextBase>No players have joined yet.</TextBase>
            ) : (
              <FlatList
                data={players}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TextBase>{item.name}</TextBase>
                )}
                scrollEnabled={players.length > 5}
                contentContainerStyle={{ flexGrow: 0, rowGap: 10 }}
              />
            )}
          </View>
        </View>
      )}
    </LayoutScreen>
  );
}

const styles = StyleSheet.create({
  hostContainer: {
    flexDirection: 'row',
    columnGap: 48, 
  },
  hostCard: {
    borderRadius: 24,
    borderWidth: 4,
    rowGap: 20,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: 300,
    paddingVertical: 20
  },
  playerListContainer: {
    flex: 1,
    rowGap: 24
  },
  label: {
    fontSize: 16,
  },
  code: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  qrContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
  },
});
