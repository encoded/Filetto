// src/screens/JoinOnlineScreen.js

import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NAVIGATION } from '@src/config/ConfigNavigation';
import LayoutScreen from './LayoutScreen';
import TextBase from '@src/components/base/TextBase';
import TextInputBase from '@src/components/base/TextInputBase';
import ButtonBase from '@src/components/base/ButtonBase';
import { useClient } from '@src/context/ClientContext';
import { CLIENT_TO_SERVER } from '@shared/messages'
import DefaultButton from '@src/components/buttons/DefaultButton';

const JoinOnlineScreen = () => {
  const { sendMessage} = useClient();
  const [roomName, setRoomName] = useState('');
  const navigation = useNavigation();

  const handleJoinRoom = () => {
    if (roomName.trim()) {
      sendMessage({ type: CLIENT_TO_SERVER.JOIN_ROOM, roomName: roomName.trim() });
      navigation.navigate(NAVIGATION.SCREENS.JOIN);
    }
  };

  return (
    <LayoutScreen style={{rowGap: 24}}>
      <TextBase>Enter Room Name:</TextBase>
      <TextInputBase
        style={{width: 250}}
        value={roomName}
        onChangeText={setRoomName}
        placeholder="e.g., my-room"
      />
      <DefaultButton text="Join Room" onPress={handleJoinRoom} />
    </LayoutScreen>
  );
};

export default JoinOnlineScreen;
