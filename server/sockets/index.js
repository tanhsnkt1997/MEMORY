// let onlineClients = new Set();
const user = {};
const initSocket = (io, eventEmitter) => {
  io.on("connection", (socket) => {
    const { id } = socket.handshake.query; //id is email

    if (!user[id]) {
      user[id] = [socket.id];
    } else {
      user[id].push(socket.id);
    }

    //emit to all tab opened
    eventEmitter.on("likeUpdated", (data) => {
      console.log("vao day may lan?? ");
      if (user[data.receiverId]) {
        user[data.receiverId].forEach((id, i) => {
          console.log("==============", id);
          io.to(id).emit("likeUpdated", { data });
        });
      }
    });

    console.log("cai nay cung hay ne", id);
    console.log("ao dieu ch", user);
    //   onlineClients.add(socket.id);
    // socket.on("new-connection", (data) => {
    //   console.log("nhan dc email", data.id); //id is email
    // });
    socket.emit("FromAPI", 1997);
    socket.on("disconnect", () => {
      user[id] = user[id].filter((id) => socket.id !== id);
      if (user[id].length === 0) {
        delete user[id];
      }
      console.log("client disconnect");
    });
  });
};

export default initSocket;
