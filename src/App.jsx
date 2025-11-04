import "./App.css";
import GameLobby from "./GameLobby";
import { WebSocketProvider } from "./contexts/WebSocketContext";

const App = () => {
  return (
    <WebSocketProvider>
      <div className="content">
        <div className="games">
          <GameLobby />
        </div>
      </div>
    </WebSocketProvider>
  );
};

export default App;
