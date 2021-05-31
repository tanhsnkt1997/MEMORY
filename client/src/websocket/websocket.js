import React, { createContext } from "react";
import io from "socket.io-client";

const WebSocketContext = createContext(null);
export { WebSocketContext };

export default function websocket({ children }) {
  const userAsync = JSON.parse(localStorage.getItem("profile"));
  console.log("trong 1111111111111", userAsync);
  let socket;
  let SERVER_URL = "http://localhost:5000";
  let ws;

  if (!socket) {
    socket = io.connect(SERVER_URL, { query: { id: userAsync?._id ? userAsync._id : userAsync.googleId } });
    socket.on("likeUpdated", (data) => {
      console.log("data updated like 1111--------------------", data);
    });
    ws = {
      socket,
    };
  }
  return <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>;
}
