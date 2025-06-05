import { useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { CLIENT_TO_SERVER } from '@shared/messages';
import { useClient } from '@src/context/ClientContext';
import { NAVIGATION } from '@src/config/ConfigNavigation';
import { ActivityIndicator } from 'react-native';
import LayoutScreen from './LayoutScreen';

const JoinFromLinkScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { sendMessage } = useClient();

  useEffect(() => {
    const roomCode = route.params?.room;
    if (roomCode) {
      sendMessage({ type: CLIENT_TO_SERVER.ENTER_ROOM, roomName: roomCode });
      navigation.replace(NAVIGATION.SCREENS.JOIN); // `replace` to remove this screen from history
    }
  }, [route.params]);

  return (
    <LayoutScreen>
      <ActivityIndicator size="large" />
    </LayoutScreen>
);

};

export default JoinFromLinkScreen;
