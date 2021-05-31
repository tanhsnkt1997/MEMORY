import React, { useRef, useEffect } from "react";
import io from "socket.io-client";

const SERVER_URL = "http://localhost:5000";
//id defined is gmail
export default function useSocket(id) {
  console.log("?????????", id);
  const socketRef = useRef(null);
  useEffect(() => {
    if (id) {
      socketRef.current = io(SERVER_URL, { query: { id } });
    }

    // socketRef.current.emit("new-connection", { id });cd
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [id]);

  const getNotificationLike = () => {
    socketRef.current.on("likeUpdated", (data) => {
      return data;
    });
  };

  //userId is userId post not me
  const sentNotifyLike = (userIdPost) => {
    //except me
    if (userIdPost !== id) {
      socketRef.current.emit("notificationLike", { userIdPost });
    }
  };

  return { sentNotifyLike, getNotificationLike };
}
