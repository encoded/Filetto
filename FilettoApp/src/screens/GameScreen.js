import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LayoutScreen from './LayoutScreen';
import TextBase from '@components/base/TextBase';
import COLORS from '@src/config/ConfigColors';
import DefaultButton from '@src/components/buttons/DefaultButton';
import { useClient } from '@src/context/ClientContext';
import { useGame } from '@src/context/GameContext';
import { SERVER_TO_CLIENT, CLIENT_TO_SERVER, SERVER_TO_ALL } from '@shared/messages';
import QuizCardTime from '@src/quiz/QuizCardTime';  // Assuming you have this component or equivalent

export default function GameScreen({ route }) {
  const { board: initialBoard, currentTurn: initialTurn } = route.params;
  const { addMessageListener, sendMessage, ipAddress } = useClient();
  const { players, playerSymbol, opponentName } = useGame();

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

      const opponent = players?.find(p => p.symbol !== playerSymbol);

      switch (data.type) {
        case SERVER_TO_ALL.MOVE_MADE:
          setQuizActive(false);
          setBoard(data.board);
          setCurrentTurn(data.currentTurn);
          break;

        case SERVER_TO_ALL.GAME_END:
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
            p => p.symbol === opponent?.symbol && p.ready
          );
          setOpponentReady(!!opponentIsReady);
          break;

        // --- Quiz related messages ---
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
          //Invalid move
        default:
          break;
      }
    });

    return unsubscribe;
  }, [addMessageListener, playerSymbol, players]);

  const handlePress = (row, col) => {
    if (!isMyTurn || result || quizActive) return;  // Don't allow moves during quiz
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

  const renderCell = (row, col) => {
    const index = row * 3 + col;
    const value = board[index];
    const isX = value === 'X';

    const borderStyles = {
      borderTopWidth: row === 0 ? 0 : 1,
      borderLeftWidth: col === 0 ? 0 : 1,
      borderColor: '#fff',
    };

    return (
      <TouchableOpacity
        key={`${row}-${col}`}
        style={[styles.cell, borderStyles]}
        onPress={() => handlePress(row, col)}
        activeOpacity={1}
      >
        <Text style={[styles.cellText, { color: isX ? COLORS.playerOne : COLORS.playerTwo }]}>
          {value}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderStatus = () => {
    if (result?.draw) return 'Draw!';
    if (result?.left) return `${opponentName} left.\nGame ended.`;
    if (result?.winner) return `Winner: ${players?.find(p => p.name === result.winner)?.name || result.winner}`;
    if (quizActive) return 'Answer the quiz question!';
    if (isMyTurn) return 'Your turn';
    return `${opponentName}'s turn`;
  };

  return (
    <LayoutScreen>
      <View style={styles.container}>

        {/* Render quiz card if quiz is active */}
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
            <View style={styles.board}>
              {[0, 1, 2].map(row => (
                <View key={row} style={styles.row}>
                  {[0, 1, 2].map(col => renderCell(row, col))}
                </View>
              ))}
            </View>

            <View style={styles.infoContainer}>
              <TextBase style={styles.infoText}>{renderStatus()}</TextBase>

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
  board: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
    marginTop: 40,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 24,
    textAlign: 'center',
  },
  opponentReadyText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
});
