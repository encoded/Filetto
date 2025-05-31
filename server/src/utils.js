/**
 * Extracts and sanitizes the IP address from a WebSocket connection.
 * Handles IPv4-mapped IPv6 addresses by removing the "::ffff:" prefix.
 *
 * @param {WebSocket} ws - The WebSocket connection object.
 * @returns {string} - The sanitized client IP address.
 */
export function getClientSanitisedIp(ws) {
  const rawIp = ws._socket.remoteAddress;
  return rawIp.startsWith("::ffff:") ? rawIp.replace("::ffff:", "") : rawIp;
}
