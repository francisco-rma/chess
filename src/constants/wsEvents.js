export const WS_EVENTS = {
  // client to server
  JOIN_QUEUE: 1,
  LEAVE_QUEUE: 2,
  MOVE: 3,
  OPPONENT_DISCONNECTED: 4,

  // server to client
  MATCH_FOUND: 5,
  BOARD_UPDATE: 6,
  MATCH_WON: 7,
  MATCH_LOST: 8,
};
