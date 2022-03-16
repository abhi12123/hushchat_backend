const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {

  console.log('socket connected:',socket.id);

  socket.on('send_join_room',(roomData)=>{
      const {name} = roomData;
      socket.join(name);
      console.log(`user ${socket.id} joined in ${name}`)
      socket.emit("receive_join_room",roomData)
  })

  socket.on("send_message",(data)=>{
      console.log(data)
        console.log(`user ${socket.id} sent a message to ${data.roomName}`)
      socket.to(data.roomName).emit("recieve_message",data)
  })

  socket.on('disconnect_user',()=>{
      socket.disconnect();
  })

  socket.on("disconnect",()=>{
      console.log("socket disconnected",socket.id)
  })
});

server.listen(3500, () => {
  console.log("server running on 3500");
});
