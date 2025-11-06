import { createContext, useContext, useEffect, useRef, useState } from "react";
const WebSocketContext = createContext(null);
const wsUri = "ws://localhost:8181/";

export function WebSocketProvider({ children, messageHandler }) {
  const wsRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(wsUri);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Connected");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      event.preventDefault();
      console.log("received message: ", event);
      const message = JSON.parse(event.data);
      messageHandler(message.type, message.payload);
      setLastMessage(data);
    };
    ws.onerror = (e) => {
      e.preventDefault();
      console.log("error: ", e);
      setIsConnected(false);
    };

    return () => {
      ws.close();
      setIsConnected(false);
    };
  }, []);

  const sendMessage = (type, payload) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log(`sending message ${payload} of type ${type}`);
      wsRef.current.send(JSON.stringify({ type, payload }));
    }
  };

  return (
    <WebSocketContext.Provider
      value={{ sendMessage, isConnected, lastMessage }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used wihtin WebSocketProvider");
  }
  return context;
};
