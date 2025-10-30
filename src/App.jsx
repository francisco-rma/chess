import "./App.css";
import { useState } from "react";
import TagInput from "./TagInput";
import Form from "./Form";
import ControlledForm from "./ControlledForm";
import TicTacToe from "./TicTacToe";
import Chess from "./Chess";
import useWebsocket from "./hooks/useWebsocket";

const App = () => {
  const wsUri = "ws://localhost:8181/";
  function WebsocketInput({ handleSubmit, status }) {
    const [input, setInput] = useState("");
    const onSubmit = (e) => {
      e.preventDefault();
      console.log("submit event: ", e);
      const value = e.target[0].value;
      console.log("value: ", value);
      handleSubmit(value);
      setInput("");
    };
    return (
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message"
        />
        <p>{status}</p>
        <button type="submit">Send</button>
      </form>
    );
    return;
  }

  const { sendMessage, isConnected } = useWebsocket(wsUri);
  return (
    <div className="content">
      <WebsocketInput handleSubmit={sendMessage} status={isConnected} />;
      <div className="games">
        <Chess color={"white"} />
      </div>
    </div>
  );
};

export default App;
