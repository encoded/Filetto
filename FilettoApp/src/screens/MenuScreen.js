import React from 'react';
import { View } from 'react-native';
import LayoutScreen from './LayoutScreen';
import TextBase from '@src/components/base/TextBase';
import { NAVIGATION } from '@config/ConfigNavigation';
import { useClient } from '@src/context/ClientContext';
import { useNetwork } from '@src/context/NetworkContext';
import { useOrientation } from '@src/context/OrientationContext';

import ImageButton from '@src/components/buttons/ImageButton';

import ImageLocal from "@assets/images/temp_local.png"
import ImageOnline from "@assets/images/temp_online.jpg"

export default function MenuScreen({ navigation }) {
  const { isLandscape } = useOrientation();

  const handlePlayLocal = () => {
    navigation.navigate(NAVIGATION.SCREENS.JOIN_LOCAL);
  };

  const handlePlayOnline = () => {
    navigation.navigate(NAVIGATION.SCREENS.JOIN_ONLINE);
  };

  return (
    <LayoutScreen>
      <View
        style={{
          flex: 1,
          width: "100%",
          flexDirection: isLandscape ? 'row' : 'column',
          gap: 48,
          paddingVertical: isLandscape ? 30 : 40,
          paddingHorizontal: isLandscape ? 40 : 30,
        }}
      >
        <ImageButton
          image={ImageLocal}
          onPress={handlePlayLocal}
        >
          <TextBase style={{fontSize: 60}}>Play Local</TextBase>
        </ImageButton>

        <ImageButton
          image={ImageOnline}
          onPress={handlePlayOnline}
        >
          <TextBase style={{fontSize: 60}}>Play Online</TextBase>
        </ImageButton>
      </View>
    </LayoutScreen>
  );
}
