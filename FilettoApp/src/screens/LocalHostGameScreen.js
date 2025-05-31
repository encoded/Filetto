import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { CLIENT_TO_SERVER, SERVER_TO_CLIENT } from '@shared/messages';
import { useClient } from '@src/context/ClientContext';
import TextBase from '@src/components/base/TextBase';
import DefaultButton from '@src/components/buttons/DefaultButton';

import { APP_ROOT } from '@src/config/ConfigNavigation';
import LayoutScreen from './LayoutScreen';

export default function LocalHostGameScreen() {
  const { sendMessage, addMessageListener } = useClient();
  const [code, setCode] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    const unsubscribe = addMessageListener((data) => {
      if (data.type === SERVER_TO_CLIENT.ROOM_CREATED) {
        const newLink = `${APP_ROOT}/join-from-link?room=${data.roomName}`;
        setCode(data.roomName);
        setLink(newLink);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    sendMessage({ type: CLIENT_TO_SERVER.CREATE_LOCAL_ROOM });
  }, []);

  return (
    <LayoutScreen style={styles.hostContainer}>
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
    </LayoutScreen>
  );
}

const styles = StyleSheet.create({
  hostContainer: {
    rowGap: 20,
  },
  label: {
    marginTop: 20,
    fontSize: 16,
  },
  code: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  qrContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
  },
});
