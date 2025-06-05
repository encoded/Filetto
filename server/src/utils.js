/**
 * Extracts and sanitizes the IP address from a WebSocket connection.
 * In development mode, generates a unique ID for local testing.
 * In production, uses the client's IP address.
 *
 * @param {WebSocket} ws - The WebSocket connection object.
 * @returns {string} - The sanitized client ID.
 */
export function getClientSanitisedIp(ws) {
  // Check if we're in development mode (you can also use an environment variable)
  const isDev = process.env.NODE_ENV === 'development' || 
                ws._socket.remoteAddress === '::1' || 
                ws._socket.remoteAddress === '127.0.0.1';

  if (isDev) {
    // For local development, generate a unique ID
    return `dev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // For production, use the IP address
  const rawIp = ws._socket.remoteAddress;
  return rawIp.startsWith("::ffff:") ? rawIp.replace("::ffff:", "") : rawIp;
}
