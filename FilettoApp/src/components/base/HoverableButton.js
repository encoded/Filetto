import React, { useRef } from "react";
import { Animated, StyleSheet, Pressable } from "react-native";

const HoverableButton = ({ style, children, ...props }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handleHoverIn = () => {
    Animated.spring(scale, {
      toValue: 1.05,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const handleHoverOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  return (
    <Pressable
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      {...props}
    >
      <Animated.View style={[styles.button, style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HoverableButton;
