import React, {useEffect} from 'react';
import LayoutScreen from './LayoutScreen';
import DefaultButton from '@src/components/buttons/DefaultButton';

import NAVIGATION from '@config/ConfigNavigation';
import TextBase from '@src/components/base/TextBase';
import { useClient } from '@src/context/ClientContext';

export default function MenuScreen({ navigation }) {  
  const {connectToHost, isConnected} = useClient();

  useEffect(() => {
    connectToHost();
  }, []);

  return (
    <LayoutScreen>
      {isConnected ? (
        <DefaultButton
          text="Join Game"
          onPress={()=>navigation.navigate(NAVIGATION.SCREENS.JOIN)}
        />
      ): (
        <TextBase style={{textAlign: 'center'}}>
          Waiting for server connection...{"\n"} 
          This should take only few seconds.
        </TextBase>
      )}
    </LayoutScreen>
  );
}
