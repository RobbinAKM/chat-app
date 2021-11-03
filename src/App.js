import React, { useState, useCallback, useRef } from "react";
import ChatClient from "./ChatClient";
const URL = "wss://0rvbq45cah.execute-api.us-east-1.amazonaws.com/production";

function App() {
  const [connect, changeConnect] = useState(false);
  const [members, setMembers] = useState([]);

  const [chats, setChat] = useState([]);
  let socket = useRef(null);

  const onSocketOpen = useCallback(() => {
    changeConnect(true);
    const name = prompt("enter your name ");
    socket.current?.send(
      JSON.stringify({
        action: "setName",
        name,
      })
    );
  }, []);

  const onSocketClose = useCallback(() => {
    changeConnect(false);
  }, []);

  const onSocketMessage = useCallback((dataStr) => {
    const data = JSON.parse(dataStr);
    if (data.members) {
      setMembers(data.members);
    } else if (data.systemMessage) {
      setChat((oldMsg) => [...oldMsg, data.systemMessage]);
    } else if (data.publicMessage) {
      setChat((oldMsg) => [...oldMsg, data.publicMessage]);
    } else if (data.privateMessage) {
      alert(data.privateMessage);
    }
  }, []);

  const onConnect = useCallback(() => {
    if (socket.current?.readyState !== WebSocket.OPEN) {
      socket.current = new WebSocket(URL);
      socket.current.addEventListener("open", onSocketOpen);
      socket.current.addEventListener("close", onSocketClose);
      socket.current.addEventListener("message", (event) => {
        onSocketMessage(event.data);
      });
    }
  }, []);

  const onSendPublicMessage = useCallback(() => {
    const message = prompt("Enter a public message");
    socket.current?.send(
      JSON.stringify({
        action: "sendPublic",
        message,
      })
    );
  }, []);

  const onSendPrivateMessage = useCallback((to) => {
    const message = prompt("Enter a private message for " + to);
    socket.current?.send(
      JSON.stringify({
        action: "sendPrivate",
        message,
        to,
      })
    );
  }, []);

  const onDisconnect = useCallback(() => {
    socket.current?.close();
    setChat([]);
    setMembers([]);
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <ChatClient
          members={members}
          chats={chats}
          changeConnect={changeConnect}
          connect={connect}
          onSendPublicMessage={onSendPublicMessage}
          onSendPrivateMessage={onSendPrivateMessage}
          onConnect={onConnect}
          onDisconnect={onDisconnect}
        />
      </header>
    </div>
  );
}

export default App;
