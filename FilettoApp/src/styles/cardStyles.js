import { StyleSheet } from 'react-native';

const cardStyles = StyleSheet.create({
  card: {
    width: 300,
    height: 200,
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
  },
});

export default cardStyles;
