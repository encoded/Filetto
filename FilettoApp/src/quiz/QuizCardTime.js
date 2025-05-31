import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import QuizCard from './QuizCard';
import QuizTimeOverlay from './QuizTimeOverlay';

const QuizCardTime = (props) => {
  const {timeLimitSeconds, ...rest} = props;
  const { question } = rest;

  const [remainingTime, setRemainingTime] = useState(timeLimitSeconds);
  
  useEffect(() => {
    setRemainingTime(timeLimitSeconds);

    if(!timeLimitSeconds)
    {
      return;
    }

    const interval = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [question, timeLimitSeconds]);
  

  return (
    <QuizCard
      {...props}
      renderCardOverlay={() => {return <QuizTimeOverlay remainingTime={remainingTime}/>}}
    />
  );
};

export default QuizCardTime;
