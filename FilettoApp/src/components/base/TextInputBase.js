import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import COLORS from '@src/config/ConfigColors';

const TextInputBase = (props) => {
  const { children, style, ...rest} = props;

  return (
    <TextInput 
      style={[styles.input, style]} 
      placeholderTextColor={'#ccc'}
      textAlignVertical="center" 
      {...rest}
    >
      {children}
    </TextInput>
  );
};

const styles = StyleSheet.create({
  input: {
    minWidth: '100%', 
    height: 50, 
    borderColor: '#ccc',
    borderWidth: 1, 
    paddingLeft: 10,
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  }
});

export default TextInputBase;
