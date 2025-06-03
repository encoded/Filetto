import React from "react";
import { StyleSheet } from "react-native";
import COLORS from "@src/config/ConfigColors";
import HoverableButton from "@src/components/base/HoverableButton";
import TextBase from "@src/components/base/TextBase";

/*
  Default button component
*/
const DefaultButton = ({text, style, textStyle, disabled, ...props}) => {
  return (
    <HoverableButton 
      style={[styles.button, disabled && styles.buttonDisabled, style]}
      disabled={disabled}
      {...props}
    >
      <TextBase style={[styles.buttonText, textStyle]}>
        {text}
      </TextBase>
    </HoverableButton>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.button,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2
  },
  buttonDisabled: {
    backgroundColor: COLORS.buttonDisabled,
  },
  buttonText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold"
  },
});

export default DefaultButton;
