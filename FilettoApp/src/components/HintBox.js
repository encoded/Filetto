import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Animated,
} from 'react-native';
import TextBase from './base/TextBase';
import COLORS from '@src/config/ConfigColors';

export default function HintBox({ hint, style, textStyle, children }) {
  const [isHovered, setIsHovered] = useState(false);
  const childTranslate = useRef(new Animated.Value(0)).current;
  const hintOpacity = useRef(new Animated.Value(0)).current;

  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    if (isWeb && isHovered) {
      Animated.parallel([
        Animated.timing(childTranslate, {
          toValue: -10,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(hintOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(childTranslate, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(hintOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isHovered, isWeb]);

  if (!isWeb) {
    // If not on web, render children only, no hover, no hint
    return <View style={styles.container}>{children}</View>;
  }

  return (
    <View
      style={styles.container}
      onMouseEnter={() => Platform.OS === 'web' && setIsHovered(true)}
      onMouseLeave={() => Platform.OS === 'web' && setIsHovered(false)}
    >
      <Animated.View
        style={[
          styles.childWrapper,
          { transform: [{ translateY: childTranslate }] },
        ]}
      >
        {children}
      </Animated.View>

      <Animated.View style={[styles.hintBox, { opacity: hintOpacity, backgroundColor: COLORS.primary}, style]}>
        <TextBase style={[styles.hintText, textStyle]}>{hint}</TextBase>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
  },
  hintBox: {
    marginTop: 8,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    maxWidth: "80%",
  },
  hintText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 24
  },
  childWrapper: {
    zIndex: 1,
  },
});
