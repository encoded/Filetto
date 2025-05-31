import React from 'react';
import TextBase from '@components/base/TextBase';

export default function GameStatusText({
  result,
  quizActive,
  isMyTurn,
  opponentName,
  players,
  currentTurn,
  playerSymbol
}) {
  const getStatus = () => {
    if (result?.draw) return 'Draw!';
    if (result?.left) return `${opponentName} left.\nGame ended.`;
    if (result?.winner) {
      const winnerName = players?.find(p => p.name === result.winner)?.name || result.winner;
      return `Winner: ${winnerName}`;
    }
    if (quizActive) return 'Answer the quiz question!';
    if (currentTurn === playerSymbol) return 'Your turn';
    return `${opponentName}'s turn`;
  };

  return (
    <TextBase style={{ fontSize: 24, textAlign: 'center' }}>
      {getStatus()}
    </TextBase>
  );
}
