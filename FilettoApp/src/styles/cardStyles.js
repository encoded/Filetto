import { StyleSheet } from 'react-native';

const cardStyles = StyleSheet.create({
  card: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: "center",
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: "#000",
  },
  description: {
    fontSize: 12,
    textAlign: 'center',
    color: "#000",
    maxWidth: 300,
  },
});

export default cardStyles;
