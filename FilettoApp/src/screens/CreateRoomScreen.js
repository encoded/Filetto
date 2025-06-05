import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import TextBase from '@src/components/base/TextBase';
import DefaultButton from '@src/components/buttons/DefaultButton';

import LayoutScreen from './LayoutScreen';
import COLORS from '@src/config/ConfigColors';
import TabSelector from '@src/components/base/TabSelector';
import cardStyles from '@src/styles/cardStyles';
import { useNavigation } from '@react-navigation/native';
import { NAVIGATION } from '@src/config/ConfigNavigation';
import { useClient } from '@src/context/ClientContext';
import { CLIENT_TO_SERVER, SERVER_TO_CLIENT } from '@shared/messages';

const PLAY_MODES = {
  PRESENTER: "Presenter",
  PLAYER: "Player"
}

export default function CreateRoomScreen() {
  const navigation = useNavigation();
  const { sendMessage, addMessageListener } = useClient();
  const [playMode, setPlayMode] = useState(PLAY_MODES.PRESENTER);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const unsubscribe = addMessageListener((data) => {
      if (data.type === SERVER_TO_CLIENT.ROOM_CREATED) {
        if(data.mode === PLAY_MODES.PRESENTER) {
          navigation.replace(NAVIGATION.SCREENS.ROOM);
        }
        else {
          navigation.replace(NAVIGATION.SCREENS.JOIN, {
            roomCode: data.roomName,
            isOwner: true,
            mode: playMode.toLowerCase()
          });
        }
  }});

    return unsubscribe;
  }, [playMode]);

  useEffect(() => {
    let text = "";
    switch(playMode) {
      case PLAY_MODES.PLAYER:
        text = "Use this device as player, no shared screen needed!"
        break;
      case PLAY_MODES.PRESENTER:
        text = "Start a game on this device - this device will act as the main game screen and host."
        break;
      default:
        break; 
    }

    setDescription(text);
  }, [playMode]);

  const handleStart = () => {
    // Create room directly
    sendMessage({ 
      type: CLIENT_TO_SERVER.CREATE_ROOM,
      gameType: 'filetto',
      mode: playMode
    });
  };

  return (
    <LayoutScreen>
      <View style={cardStyles.card}>
        <TextBase style={cardStyles.title}>
          Game Mode
        </TextBase>
        <TabSelector
          tabs={Object.values(PLAY_MODES)}
          initialTab={playMode}
          onSelectionChanged={setPlayMode}
          style={styles.tabContainer}
          styleTabSelected={styles.selectedTab}
          styleTabText={styles.tabText}
          styleTabTextSelected={styles.tabTextSelected}
        />
        <TextBase style={[cardStyles.description, {minHeight: 50, minWidth: 300}]}>
          {description}
        </TextBase>
      </View>
      <DefaultButton 
        style={styles.startButton} 
        text="Create Room"
        onPress={handleStart}
      />
    </LayoutScreen>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    width: 300,
  },
  selectedTab: {
    backgroundColor: COLORS.special,
  },
  tabText: {
    color: "#000",
  },
  tabTextSelected: {
    fontWeight: 'bold',
  },
  startButton: {
    marginTop: 20,
  }
});
