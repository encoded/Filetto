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
import { useNavigation } from '@react-navigation/native';
import { useOrientation } from '@src/context/OrientationContext';
import cardStyles from '@src/styles/cardStyles';
import COLORS from '@src/config/ConfigColors';

export default function RoomScreen({ route }) {
  const navigation = useNavigation();
  const { isLandscape } = useOrientation();
  const { sendMessage, addMessageListener } = useClient();
  const { players, isOwner, mode, roomName: roomCode } = useGame();
  const [code, setCode] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    if(isOwner) {
      const newLink = `${APP_ROOT}/join-from-link?room=${roomCode}`;
      setCode(roomCode);
      setLink(newLink);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = addMessageListener((data) => {
      if (data.type === SERVER_TO_ALL.GAME_START) {
        navigation.navigate(mode === 'presenter' ? NAVIGATION.SCREENS.HOST_GAME : NAVIGATION.SCREENS.GAME, {
          board: data.board,
          currentTurn: data.currentTurn,
          playersData: data.playersData
        });
      }
    });

    return unsubscribe;
  }, [mode]);

  const handleStartGame = () => {
    sendMessage({ type: CLIENT_TO_SERVER.START_GAME });
  };

  if (!isOwner) {
    return (
      <LayoutScreen>
        <View style={[cardStyles.card, { alignItems: 'center' }]}>
          <TextBase style={cardStyles.title}>Waiting for game to start...</TextBase>
          <TextBase style={cardStyles.description}>The room owner will start the game when all players are ready.</TextBase>
          {players.length > 0 && (
            <View style={styles.playersContainer}>
              <TextBase style={styles.playersTitle}>Players in room:</TextBase>
              <FlatList
                data={players}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TextBase style={styles.playerName}>{item.name}</TextBase>
                )}
                scrollEnabled={players.length > 5}
                contentContainerStyle={{ flexGrow: 0, rowGap: 10 }}
              />
            </View>
          )}
        </View>
      </LayoutScreen>
    );
  }

  const renderStartButton = () => {
    return (
      <DefaultButton 
        text="Start Game" 
        onPress={handleStartGame}
        style={styles.startButton}
        disabled={players.length < 2}
      />
    );
  };

  return (
    <LayoutScreen style={styles.hostContainer}>
      <View style={{flexDirection: "column", rowGap: 24}}>
        <View style={{alignItems: "center"}}>
          <View style={[styles.hostCard, {borderColor: "#fff"}]}>
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
        {!isLandscape && renderStartButton()}
      </View>
      {isLandscape && (
      <View style={{flexDirection: "column", rowGap: 24}}> 
        <View style={[cardStyles.card]}>
          <TextBase style={cardStyles.title}>Players</TextBase>
          <View>
            {players.length === 0 ? (
              <TextBase style={cardStyles.description}>No players have joined yet.</TextBase>
            ) : (
              <FlatList
                data={players}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TextBase style={cardStyles.description}>{item.name}</TextBase>
                )}
                scrollEnabled={players.length > 5}
                contentContainerStyle={{ flexGrow: 0, rowGap: 10 }}
              />
            )}
          </View>
        </View>
        <View style={{alignItems: "center"}}>
          {renderStartButton()}
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
    paddingVertical: 20,
  },
  label: {
    fontSize: 16,
    color: COLORS.textSecondary
  },
  code: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 10,
    color: COLORS.textSecondary
  },
  qrContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  startButton: {
    width: 300,
    alignSelf: 'center'
  },
  playersContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center'
  },
  playersTitle: {
    marginBottom: 10,
    fontWeight: '600',
  },
  playerName: {
    fontSize: 16
  }
});
