import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default QuizTimeOverlay = ({remainingTime}) => {
  return (
    <Text style={styles.timeText}>{remainingTime}</Text>
  )
};

const styles = StyleSheet.create({
  timeText: {
    textAlign: 'center',
    fontSize: 24,
  }
});
