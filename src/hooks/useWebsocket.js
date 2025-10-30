import { useState, useEffect, useRef } from "react";

function useWebsocket(wsUri) {
  const websocketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(wsUri);
    websocketRef.current = ws;

    ws.onopen = () => {
      console.log("Connected");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      event.preventDefault();
      console.log("received message: ", event);
    };

    ws.onerror = (e) => {
      e.preventDefault();
      console.log("error: ", e);
    };

    return () => {
      ws.close();
      setIsConnected(false);
    };
  }, [wsUri]);

  const sendMessage = (message) => {
    console.log(websocketRef);
    console.log("Attempting to send message: ", message);
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      console.log("sending message: ", message);
      websocketRef.current.send(message);
    }
  };

  return { sendMessage, isConnected };
}

export default useWebsocket;
