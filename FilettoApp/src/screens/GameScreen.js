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

export default function GameScreen({ route }) {
  const { addMessageListener, sendMessage } = useClient();
  const { players, playerId } = useGame();
  const { board: initialBoard, currentTurn: initialTurn, playersData } = route.params;

  // Only try to find players after we have playerId
  const thisPlayer = playersData.find(p => p.id === playerId);
  const otherPlayer = playersData.find(p => p.id !== playerId);

  if (!thisPlayer || !otherPlayer) {
    console.warn("Player(s) not found", { thisPlayer, otherPlayer, playerId, playersData });
  }

  const playerSymbol = thisPlayer.symbol;
  const opponentName = otherPlayer.name;

  const [board, setBoard] = useState(initialBoard);
  const [currentTurn, setCurrentTurn] = useState(initialTurn);
  const [result, setResult] = useState(null);
  const [opponentReady, setOpponentReady] = useState(false);
  const [iAmReady, setIAmReady] = useState(false);

  // --- Quiz states ---
  const [quizActive, setQuizActive] = useState(false);
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [timeLimit, setTimeLimit] = useState(null);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const isMyTurn = currentTurn === playerSymbol;

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
          setOpponentReady(false);
          setIAmReady(false);
          break;

        case SERVER_TO_ALL.READY_STATUS:
          const opponentIsReady = data.players?.find(
            p => p.id !== otherPlayer.id && p.ready
          );
          setOpponentReady(!!opponentIsReady);
          break;

        // --- Quiz ---
        case SERVER_TO_ALL.QUESTION_START:
          setQuizActive(true);
          setHasAnswered(false);
          setQuestion(data.question);
          setOptions(data.options);
          setTimeLimit(data.timeLimit);
          setCorrectIndex(null);
          break;

        case SERVER_TO_ALL.QUESTION_END:
          setCorrectIndex(data.correctIndex);
          break;

        case SERVER_TO_CLIENT.INVALID_MOVE:
        default:
          break;
      }
    });

    return unsubscribe;
  }, [addMessageListener, players, playerId]);

  const handlePress = (row, col) => {
    if (!isMyTurn || result || quizActive) return;
    const index = row * 3 + col;
    if (board[index]) return;

    sendMessage({ type: CLIENT_TO_SERVER.MAKE_MOVE, cellIndex: index });
  };

  const handlePlayAgain = () => {
    sendMessage({ type: CLIENT_TO_SERVER.READY });
    setIAmReady(true);
  };

  const handleAnswer = (index) => {
    if (!hasAnswered) {
      setHasAnswered(true);
      sendMessage({ type: CLIENT_TO_SERVER.SUBMIT_ANSWER, selectedIndex: index });
    }
  };

  return (
    <LayoutScreen>
      <View style={styles.container}>
        {quizActive && question ? (
          <QuizCardTime
            question={question}
            options={options}
            correctAnswer={correctIndex !== null ? options[correctIndex] : null}
            onOptionChosen={handleAnswer}
            timeLimitSeconds={!hasAnswered ? timeLimit : null}
            style={{ maxHeight: '70%' }}
          />
        ) : (
          <>
            <GameBoard
              board={board}
              onCellPress={handlePress}
              disabled={!isMyTurn || result || quizActive}
            />

            <View style={styles.infoContainer}>
              <GameStatusText
                result={result}
                quizActive={quizActive}
                isMyTurn={isMyTurn}
                opponentName={opponentName}
                players={players}
                currentTurn={currentTurn}
                playerSymbol={playerSymbol}
              />

              {result && !result.left && (
                <>
                  <DefaultButton
                    text="Play Again"
                    onPress={handlePlayAgain}
                    style={{ marginTop: 20 }}
                    disabled={iAmReady}
                  />
                  {opponentReady && !iAmReady && (
                    <TextBase style={styles.opponentReadyText}>
                      {opponentName} wants to play another match. Click "Play Again" to start.
                    </TextBase>
                  )}
                  {iAmReady && (
                    <TextBase style={styles.opponentReadyText}>
                      Waiting for {opponentName} to confirm the new match...
                    </TextBase>
                  )}
                </>
              )}
            </View>
          </>
        )}
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
  opponentReadyText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.textSecondary
  },
});
