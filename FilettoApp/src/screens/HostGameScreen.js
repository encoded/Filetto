import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LayoutScreen from './LayoutScreen';
import TextBase from '@components/base/TextBase';
import COLORS from '@src/config/ConfigColors';
import DefaultButton from '@src/components/buttons/DefaultButton';
import { useClient } from '@src/context/ClientContext';
import { useGame } from '@src/context/GameContext';
import { SERVER_TO_CLIENT, CLIENT_TO_SERVER, SERVER_TO_ALL } from '@shared/messages';
import QuizCardTime from '@src/quiz/QuizCardTime';

import GameBoard from '@src/game/GameBoard';
import GameStatusText from '@src/game/GameStatusText';

export default function HostGameScreen({ route }) {
  const { board: initialBoard, currentTurn: initialTurn } = route.params;
  const { addMessageListener, sendMessage } = useClient();
  const { players, playerSymbol, opponentName } = useGame();

  const [board, setBoard] = useState(initialBoard);
  const [currentTurn, setCurrentTurn] = useState(initialTurn);
  const [result, setResult] = useState(null);

  // --- Quiz states ---
  const [quizActive, setQuizActive] = useState(false);
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [timeLimit, setTimeLimit] = useState(null);
  const [correctIndex, setCorrectIndex] = useState(null);

  useEffect(() => {
    const unsubscribe = addMessageListener((data) => {
      switch (data.type) {
        case SERVER_TO_ALL.MOVE_MADE:
          setQuizActive(false);
          setBoard(data.board);
          setCurrentTurn(data.currentTurn);
          break;

        case SERVER_TO_ALL.GAME_END:
          setQuizActive(false);
          setBoard(data.board);
          if (data.result === 'draw') setResult({ draw: true });
          else if (data.result === 'win') setResult({ winner: data.winner });
          break;

        case SERVER_TO_ALL.PLAYER_LEFT:
          setResult({ left: true });
          break;

        case SERVER_TO_ALL.GAME_START:
          setBoard(data.board);
          setCurrentTurn(data.currentTurn);
          setResult(null);
          break;

        case SERVER_TO_ALL.QUESTION_START:
          setQuizActive(true);
          setQuestion(data.question);
          setOptions(data.options);
          setTimeLimit(data.timeLimit);
          setCorrectIndex(null);
          break;

        case SERVER_TO_ALL.QUESTION_END:
          setCorrectIndex(data.correctIndex);
          break;

        default:
          break;
      }
    });

    return unsubscribe;
  }, [addMessageListener]);

  const handleHostStartGame = () => {
    console.log("Whatever!");
  };

  const handleSendQuestion = () => {
    console.log("Whatever!");
  };

  return (
    <LayoutScreen>
      <View style={styles.container}>
        {quizActive && question ? (
          <QuizCardTime
            question={question}
            options={options}
            correctAnswer={correctIndex !== null ? options[correctIndex] : null}
            timeLimitSeconds={timeLimit}
            style={{ maxHeight: '70%' }}
            disabled // no answering for host
          />
        ) : (
          <>
            <GameBoard
              board={board}
              onCellPress={() => {}} // no-op
              disabled // fully non-interactive
            />

            <View style={styles.infoContainer}>
              <GameStatusText
                result={result}
                quizActive={quizActive}
                isMyTurn={false}
                opponentName={opponentName}
                players={players}
                currentTurn={currentTurn}
                playerSymbol={playerSymbol}
              />
            </View>
          </>
        )}

        {/* Host-only control panel */}
        <View style={styles.hostPanel}>
          <TextBase style={styles.hostTitle}>Host Controls</TextBase>
          <DefaultButton
            text="End Game"
            onPress={handleHostStartGame}
            style={{ marginVertical: 10 }}
          />
        </View>
      </View>
    </LayoutScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    flex: 1,
    marginTop: 40,
    alignItems: 'center',
  },
  hostPanel: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: COLORS.GRAY,
    width: '100%',
    alignItems: 'center',
  },
  hostTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
