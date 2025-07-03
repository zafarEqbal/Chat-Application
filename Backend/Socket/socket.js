

// import { Server } from "socket.io";
// import http from "http";
// import express from "express";

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: ['http://localhost:5173'], // or add deployed client URL too
//     methods: ["GET", "POST"],
//   },
// });

// const usersocketMap = {}; // userId -> socketId

// export const getReceiverSocketId = (receiverObjectId) => {
//   return usersocketMap[receiverObjectId];
// };

// io.on('connection', (socket) => {
//   console.log('🔌 user connected', socket.id);

//   const userId = socket.handshake.query.userId;
//   if (userId) {
//     usersocketMap[userId] = socket.id;
//   }

//   // Send updated online users to everyone
//   io.emit('getOnlineUsers', Object.keys(usersocketMap));

//   // ✅ Listen for new messages inside the connection
//   socket.on('newMessage', (message) => {
//     const receiverSocketId = usersocketMap[message.to];
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit('receiveMessage', message);
//     }
//   });

//   // Cleanup on disconnect
//   socket.on('disconnect', () => {
//     console.log('🔌 user disconnected', socket.id);
//     if (userId) {
//       delete usersocketMap[userId];
//     }
//     io.emit('getOnlineUsers', Object.keys(usersocketMap));
//   });
// });

// export { app, io, server };


import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'],
    methods: ["GET", "POST"],
  },
});

const usersocketMap = {}; // userId -> socketId

export const getReceiverSocketId = (receiverObjectId) => {
  return usersocketMap[receiverObjectId];
};

io.on('connection', (socket) => {
  console.log('🔌 user connected', socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    usersocketMap[userId] = socket.id;
  }

  io.emit('getOnlineUsers', Object.keys(usersocketMap));

  // ✅ Send message
  socket.on('newMessage', (message) => {
    const receiverSocketId = usersocketMap[message.to];
    message.status = receiverSocketId ? 'delivered' : 'sent';
    message.createdAt = new Date().toISOString();

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', message);
    }

    // You can save message to DB here
  });

  // ✅ Message marked as read
  socket.on("messageRead", (messageId) => {
    io.emit("messageReadStatusUpdate", { messageId, status: "read" });
  });

  socket.on('disconnect', () => {
    console.log('🔌 user disconnected', socket.id);
    if (userId) delete usersocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(usersocketMap));
  });
});

export { app, io, server };
