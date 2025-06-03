import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import TextBase from "./TextBase";

/*
  Base component for text button components.
*/
const TextButton = ({ text, textStyle, style, ...props }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} {...props}>
      <TextBase style={textStyle}>{text}</TextBase>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TextButton;
