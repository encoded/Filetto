import React from "react";
import { StyleSheet } from "react-native";
import ButtonBase from "@components/base/ButtonBase";
import COLORS from "@src/config/ConfigColors";

/*
  Default button component
*/
const DefaultButton = ({style, textStyle, disabled, ...props}) => {
  return (
    <ButtonBase
      style={[styles.button, disabled && styles.buttonDisabled, style]}
      textStyle={[styles.buttonText, textStyle]}
      disabled={disabled}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.button,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: COLORS.buttonDisabled,
  },
  buttonText: {
    fontSize: 18,
  },
});

export default DefaultButton;
