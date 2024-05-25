const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const Note = require('./Models/Notes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server);

mongoose
  .connect(
    "mongodb+srv://steve:steve123steve@firstcluster.d4jodqk.mongodb.net/?retryWrites=true&w=majority&appName=firstCluster"
  )
  .then(() => {
    server.listen(PORT, () => { // استخدم server.listen بدلاً من app.listen
      console.log("Server is running on port", PORT);
    });
  })
  .catch((err) => {
    console.log("Database connection error:", err);
  });

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('addNote', async (data) => {
    try {
      const newNote = new Note();
      newNote.__id = data.__id;
      newNote.content = data.content;
      await newNote.save();

      io.emit('noteAdded', newNote); // إرسال الملاحظة الجديدة لجميع العملاء
    } catch (err) {
      console.error("Error adding note:", err);
    }
  });

  socket.on('getAllNotes', async () => {
    try {
      const notes = await Note.find();
      socket.emit('allNotes', notes); // إرسال جميع الملاحظات للعميل
    } catch (err) {
      console.error("Error getting notes:", err);
    }
  });
});

// مسارات Express
app.get('/getall', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json({ notes });
  } catch (err) {
    res.status(500).send("Error getting all notes");
  }
});

app.post('/addone', async (req, res) => {
  try {
    const { __id, content } = req.body;
    const newNote = new Note();
    newNote.__id = __id;
    newNote.content = content;

    await newNote.save();
    res.json(newNote);

    io.emit('noteAdded', newNote); // إرسال الملاحظة الجديدة لجميع العملاء
  } catch (err) {
    res.status(500).send("Error adding note");
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
