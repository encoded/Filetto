import React from 'react';
import LayoutScreen from './LayoutScreen';
import DefaultButton from '@src/components/buttons/DefaultButton';

import NAVIGATION from '@config/ConfigNavigation';

export default function MenuScreen({ navigation }) {  
  return (
    <LayoutScreen>
      <DefaultButton
        text="Join Game"
        onPress={()=>navigation.navigate(NAVIGATION.SCREENS.JOIN)}
      />
    </LayoutScreen>
  );
}
