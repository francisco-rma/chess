import { useState, useEffect } from "react";
import { useWebSocket } from "./contexts/WebSocketContext";
import { WS_EVENTS } from "./constants/wsEvents";
import Chess from "./Chess";

export function GameLobby() {
  const { sendMessage, lastMessage, isConnected } = useWebSocket();
  const [inGame, setInGame] = useState(false);
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    if (lastMessage && lastMessage.type === WS_EVENTS.MATCH_FOUND) {
      setInGame(true);
      setGameData(lastMessage.payload);
    }
  }, [lastMessage]);

  const handleJoinQueue = () => {
    sendMessage(WS_EVENTS.JOIN_QUEUE, { playerName: "Player1" });
  };

  let chess = <Chess color={"white"} />;

  if (inGame) {
    return chess;
  }
  return (
    <div>
      <h2>Lobby</h2>
      <button onClick={handleJoinQueue} disabled={!isConnected}>
        Find match!
      </button>
    </div>
  );
}
export default GameLobby;
