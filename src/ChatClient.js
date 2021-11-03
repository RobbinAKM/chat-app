import React from "react";
import "./chatclient.css";

const ChatClient = ({
  members,
  chats,
  changeConnect,
  connect,
  onSendPublicMessage,
  onSendPrivateMessage,
  onConnect,
  onDisconnect,
}) => {
  return (
    <div className="container">
      <div className="userList">
        {members.map((member) => (
          <ul key={member}>
            <li onClick={() => onSendPrivateMessage(member)}>{member}</li>
          </ul>
        ))}
      </div>
      <div className="messageList">
        {chats.map((chat) => (
          <p key={chat}>{chat}</p>
        ))}
      </div>
      <div className="active-icon">
        {connect ? (
          <span className="logged-in">●</span>
        ) : (
          <span className="logged-out">●</span>
        )}
      </div>
      <div className="buttonBox">
        {connect ? (
          <button onClick={() => onSendPublicMessage()}>
            Send Public Message
          </button>
        ) : null}

        {connect ? (
          <button onClick={() => onDisconnect()}>Disconnect</button>
        ) : (
          <button onClick={() => onConnect()}>Connect</button>
        )}
      </div>
    </div>
  );
};

export default ChatClient;
