import React from 'react';
import { View } from 'react-native';
import LayoutScreen from './LayoutScreen';
import TextBase from '@src/components/base/TextBase';
import { NAVIGATION } from '@config/ConfigNavigation';
import { useClient } from '@src/context/ClientContext';
import { useNetwork } from '@src/context/NetworkContext';
import { useOrientation } from '@src/context/OrientationContext';
import HintBox from '@src/components/HintBox';

import ImageButton from '@src/components/buttons/ImageButton';

import ImageLocal from "@assets/images/temp_local.png"
import ImageOnline from "@assets/images/temp_online.jpg"

export default function MenuScreen({ navigation }) {
  const { isLandscape } = useOrientation();

  const handlePlayLocal = () => {
    navigation.navigate(NAVIGATION.SCREENS.PLAY_LOCAL);
  };

  const handlePlayOnline = () => {
    navigation.navigate(NAVIGATION.SCREENS.PLAY_ONLINE);
  };

  return (
    <LayoutScreen>
      <View
        style={{
          flex: 1,
          width: "100%",
          flexDirection: isLandscape ? 'row' : 'column',
          gap: 48,
          paddingVertical: isLandscape ? 100 : 40,
          paddingHorizontal: isLandscape ? 40 : 30,
        }}
      >
        <ImageButton
          image={ImageLocal}
          onPress={handlePlayLocal}
        >
          <HintBox hint="
            Play locally with other players in the same room.
            One device acts as the host and shows the game, 
            while each player connects with their phone to use as a controller.
          ">
            <TextBase style={{fontSize: 60}}>Play Local</TextBase>
          </HintBox>
        </ImageButton>

        <ImageButton
          image={ImageOnline}
          onPress={handlePlayOnline}
        >
          <HintBox hint="
            Play online with other players remotely. 
            Everyone joins the game directly from their own device—no host needed, 
            and you can play from anywhere.
          ">
          <TextBase style={{fontSize: 60}}>Play Online</TextBase>
          </HintBox>
        </ImageButton>
      </View>
    </LayoutScreen>
  );
}
