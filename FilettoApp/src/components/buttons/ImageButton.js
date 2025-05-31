import React, { useState } from 'react';
import {
  Pressable,
  ImageBackground,
  StyleSheet,
  Platform,
  View,
} from 'react-native';

export default function ImageButton({
  image,
  onPress,
  style,
  children,
  saturationOnHover = 1,
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Only applies on web
  const saturationStyle =
    Platform.OS === 'web'
      ? {
          filter: `saturate(${isHovered ? saturationOnHover : 0.3})`,
        }
      : {};

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={({ pressed }) => [
        styles.defaultButton,
        style,
        { opacity: pressed ? 0.9 : 1 },
      ]}
    >
      <ImageBackground
        source={image}
        resizeMode="cover"
        style={styles.imageBackground}
        imageStyle={[StyleSheet.absoluteFill, saturationStyle]}
      >
        {children}
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  defaultButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
