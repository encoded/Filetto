import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useOrientation } from '@src/context/OrientationContext';
import { useNavigation } from '@react-navigation/native';

import ImageHost from '@assets/images/temp_host.jpg';
import ImageJoin from '@assets/images/temp_join.png';

import ImageButton from '@src/components/buttons/ImageButton';
import HintBox from '@src/components/HintBox';
import TextBase from '@src/components/base/TextBase';

import LayoutScreen from './LayoutScreen';
import { NAVIGATION } from '@src/config/ConfigNavigation';

const PlayLocalScreen = () => {
  const { isLandscape } = useOrientation();
  const navigation = useNavigation();

  return (
    <LayoutScreen>
      <View
        style={{
          flex: 1,
          width: '100%',
          flexDirection: isLandscape ? 'row' : 'column',
          gap: 48,
          paddingVertical: isLandscape ? 100 : 40,
          paddingHorizontal: isLandscape ? 40 : 30,
        }}
      >
        <ImageButton image={ImageHost} onPress={() => navigation.navigate(NAVIGATION.SCREENS.LOCAL_HOST_GAME)}>
          <HintBox
            hint="
              Start a game on your device that others in the same space can join. 
              Your device acts as the game screen and host.
            "
          >
            <TextBase style={{ fontSize: 60 }}>Host a Game</TextBase>
          </HintBox>
        </ImageButton>

        <ImageButton image={ImageJoin} onPress={() => navigation.navigate(NAVIGATION.SCREENS.LOCAL_JOIN_GAME)}>
          <HintBox
            hint="
              Connect your phone to a nearby host’s game and use it as your controller to play.
            "
          >
            <TextBase style={{ fontSize: 60 }}>Join a Game</TextBase>
          </HintBox>
        </ImageButton>
      </View>
    </LayoutScreen>
  );
}

export default PlayLocalScreen;
