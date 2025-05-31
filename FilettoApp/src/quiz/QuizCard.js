import React, { useState, useEffect, useDebugValue } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const QuizCard = ({
  question,
  options,
  correctAnswer, // this is null during countdown, becomes a string after timeout
  onOptionChosen,
  style,
  disabled = false,
  renderOptionOverlay = () => null,
  renderCardOverlay = () => null,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const correctIndex = correctAnswer != null ? options.findIndex(opt => opt === correctAnswer) : null;

  useEffect(()=>{
    setSelectedIndex(null);
  }, [question, options])

  const onOptionPress = (index) => {
    if (selectedIndex !== null || correctAnswer !== null) return; // prevent multi-select or late correctAnswer
    setSelectedIndex(index);
    onOptionChosen(index);
  };

  return (
    <View style={[styles.card, style]}>
      {/* Render widget in top-right of the card*/}
      <View style={styles.cardOverlayContainer}>
        {renderCardOverlay()}
      </View>

      <View style={styles.questionContainer}>
        <Text style={[styles.text, styles.question]}>{question}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {options.map((option, index) => {
          const isSelected = index === selectedIndex;
          const isCorrect = index === correctIndex;

          let buttonStyle = styles.optionButton;
          if (correctAnswer !== null) {
            if (isCorrect) {
              buttonStyle = [buttonStyle, styles.correctAnswer];
            } else if (isSelected) {
              buttonStyle = [buttonStyle, styles.wrongAnswer];
            }
          } else if (isSelected) {
            buttonStyle = [buttonStyle, styles.selectedOption];
          }

          return (
            <TouchableOpacity
              key={index}
              style={buttonStyle}
              onPress={() => onOptionPress(index)}
              disabled={disabled || selectedIndex !== null || correctAnswer !== null}
            >
              <Text style={[styles.text, styles.optionText]}>{option}</Text>

              {/* Render widget in top-right */}
              <View style={styles.optionOverlayContainer}>
                {renderOptionOverlay(index)}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#fff',
    width: '100%',
    borderWidth: 2,
    borderColor: '#000'
  },
  cardOverlayContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    marginRight: 20,
    marginTop: 20
  },
  text: {
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionsContainer: {
    flex: 2,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 12,
    marginVertical: 5,
    width: '50%',
  },
  selectedOption: {
    backgroundColor: '#d3d3d3', // light grey
    borderWidth: 2,
    borderColor: '#a9a9a9', // dark grey
  },
  correctAnswer: {
    backgroundColor: '#50D960',
  },
  wrongAnswer: {
    backgroundColor: '#EE4B2B',
  },
  optionText: {
    fontSize: 16,
  },
  optionOverlayContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  }  
});

export default QuizCard;
