import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import COLORS from '@src/config/ConfigColors';

export default function GameBoard({ board, onCellPress, disabled = false }) {
  const renderCell = (row, col) => {
    const index = row * 3 + col;
    const value = board[index];
    const isX = value === 'X';

    const borderStyles = {
      borderTopWidth: row === 0 ? 0 : 1,
      borderLeftWidth: col === 0 ? 0 : 1,
      borderColor: '#fff',
    };

    const CellWrapper = disabled ? View : TouchableOpacity;

    return (
      <CellWrapper
        key={`${row}-${col}`}
        style={[styles.cell, borderStyles]}
        onPress={() => !disabled && onCellPress?.(row, col)}
        activeOpacity={disabled ? 1 : 0.7}
      >
        <Text style={[styles.cellText, { color: isX ? COLORS.playerOne : COLORS.playerTwo }]}>
          {value}
        </Text>
      </CellWrapper>
    );
  };

  return (
    <View style={styles.board}>
      {[0, 1, 2].map(row => (
        <View key={row} style={styles.row}>
          {[0, 1, 2].map(col => renderCell(row, col))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
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
});
