#!/usr/bin/env node

/**
 * Module dependencies.t
 */

var app = require("./app");
var debug = require("debug")("backend:server");
var http = require("http");
var socketio = require("socket.io");
var cors = require("cors");
var {
  userJoin,
  getUser,
  userLeave,
  getParticipants,
} = require("./model/users");

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || "5000");
app.set("port", port);
app.use(cors());
/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * socket.io
 */
var io = socketio(server);

io.on("connection", (socket) => {
  var user;
  socket.on("join room", ({ username, room }) => {
    user = userJoin(socket.id, username, room);
    socket.emit("bot message", "Too Too Roo");
    socket.broadcast
      .to(user.room)
      .emit("bot message", `${username}  has joined the chat room`);
    socket.join(user.room);
    io.to(user.room).emit("get users", getParticipants(user.room));
  });

  socket.on("typing", (u) => {
    socket.broadcast.to(user.room).emit("bubble", u);
  });

  socket.on("stop typing", () => {
    socket.broadcast.to(user.room).emit("stop bubble", user.username);
  });

  socket.on("chat", (message) => {
    io.to(user.room).emit("message", {
      content: message,
      sender: user.username,
    });
  });

  socket.on("disconnect", () => {
    user = getUser(socket.id);
    var username = user.username;
    var room = user.room;
    userLeave(socket.id);
    io.to(room).emit("get users", getParticipants(room));
    io.to(room).emit("bot message", `${username} has left the chat`);
  });
});

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
