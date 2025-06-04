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

const PLAY_MODES = {
  PRESENTER: "Presenter",
  PLAYER: "Player"
}

export default function CreateRoomScreen() {
  const navigation = useNavigation();
  const [playMode, setPlayMode] = useState(PLAY_MODES.PRESENTER);
  const [description, setDescription] = useState("");

  useEffect(()=>{
    let text = "";
    switch(playMode){
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
    navigation.navigate(NAVIGATION.SCREENS.ROOM);
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
        <TextBase style={cardStyles.description}>
          {description}
        </TextBase>
      </View>
      <DefaultButton 
        style={styles.startButton} 
        text="Start"
        onPress={handleStart}
      />
    </LayoutScreen>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    backgroundColor: COLORS.buttonDisabled, 
    padding: 4
  },
  selectedTab: {
    backgroundColor: COLORS.special, 
    borderRadius: 10
  },
  tabText: {
    color: "#000"
  },
  tabTextSelected: {
    fontWeight: "bold"
  },
  startButton: {
    marginTop: 24,
    width: 200
  }
});
