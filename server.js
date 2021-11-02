const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = app.listen(9999, (err) => {
  if (err) {
    throw Error(err);
  }
  console.log("Сервер запущен!");
});

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const rooms = new Map();

app.get("/rooms/:id", (req, res) => {
  const roomId = req.params.id;
  const obj = rooms.has(roomId)
    ? {
        users: [...rooms.get(roomId).get("users").values()],
        messages: [...rooms.get(roomId).get("messages").values()],
      }
    : { users: [], messages: [] };
  res.json(obj);
});

app.post("/rooms", (req, res) => {
  const { roomId, userName } = req.body;
  if (!rooms.has(roomId)) {
    rooms.set(
      roomId,
      new Map([
        ["users", new Map()],
        ["messages", []],
      ])
    );
  }
  res.send();
});

io.on("connection", (socket) => {
  socket.on("ROOM:JOIN", ({ roomId, userName }) => {
    socket.join(roomId);
    rooms.get(roomId).get("users").set(socket.id, userName);
    const users = [...rooms.get(roomId).get("users").values()];
    socket.to(roomId).emit("ROOM:SET_USERS", users).broadcast;
  });

  socket.on("ROOM:NEW_MESSAGE", ({ roomId, userName, text }) => {
    const obj = {
      userName,
      text,
    }
    rooms.get(roomId).get("messages").push(obj);
    socket.to(roomId).emit("ROOM:NEW_MESSAGE", obj).broadcast
  });

  socket.on("disconnect", () => {
    rooms.forEach((value, roomId) => {
      if (value.get("users").delete(socket.id)) {
        const users = [...value.get("users").values()];
        socket.to(roomId).emit("ROOM:SET_USERS", users).broadcast;
      }
    });
  });

  console.log("user connected", socket.id);
});
