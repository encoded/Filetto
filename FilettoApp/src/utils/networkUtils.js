export const sendMessageToServer = (socket, data) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  } else {
    console.warn('Socket is not open.');
  }
};