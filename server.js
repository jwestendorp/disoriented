const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

let phones = {};

function newSocketConnection(socket) {
  let { id } = socket;

  phones[socket.id] = {
    x: 0,
    y: 0,
  };

  function socketDisconnected() {
    delete phones[socket.id];
  }

  function onAccelerometerReading(axes) {
    phones[socket.id] = axes;
    console.log(id, axes);

    // io.emit("cursor-object-changed", phones);
  }

  socket.on("disconnect", socketDisconnected);
  socket.on("accelerometer-reading", onAccelerometerReading);
}

io.on("connection", newSocketConnection);

app.use("/canvas", express.static("./app/canvas"));
app.use("/", express.static("./app/controller"));

server.listen(8080);
console.log("server running");
