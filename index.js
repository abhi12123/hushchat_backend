const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const PORT = process.env.PORT || 3500
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://abhi12123.github.io",
    methods: ["GET", "POST"],
  },
});

app.get("/rooms/:roomName", (req, res) => {
  let arr = Array.from(io.sockets.adapter.rooms);
  arr = arr.filter((room) => !room[1].has(room[0]));
  arr = arr.map((i) => i[0]);
  const room = arr.find((el) => el === req.params.roomName);
  if (room) {
    res.send({
      success: true,
      message: `The room with room name ${req.params.roomName} exists`,
    });
  } else {
    res.send({
      success: false,
      message: `The room with room name ${req.params.roomName} do not exist`,
    });
  }
});

io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);

  socket.on("send_join_room", (roomData) => {
    const { name,username } = roomData;
    socket.join(name);
    console.log(`user ${socket.id} joined in ${name}`);
    socket.emit("receive_join_room", roomData);
  });

  socket.on("send_message", (data) => {
    console.log(data);
    console.log(`user ${socket.id} sent a message to ${data.roomName}`);
    socket.to(data.roomName).emit("recieve_message", data);
  });

  socket.on("disconnect_user", () => {
    console.log('disconnecting user')
    socket.disconnect();
  });
  socket.on("disconnect", () => {
    console.log("socket disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
