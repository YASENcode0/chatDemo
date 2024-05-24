const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = 3001 || 5000;
const Note = require("./Models/Notes");

app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://steve:steve123steve@firstcluster.d4jodqk.mongodb.net/?retryWrites=true&w=majority&appName=firstCluster"
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log("listen on port ", PORT);
    });
  })
  .catch((err) => {
    console.log("err db ", err);
  });

app.get("/getall", async (req, res) => {
  try {
    await Note.find().then((response) => {
      console.log(response);
      res.json({ response });
    });
  } catch (err) {
    res.send("err gat all").status(500);
  }
});

app.post("/addone", async (req, res) => {
  try {
    const { __id, content } = req.body;
    const newNote = new Note();
    newNote.__id = __id;
    newNote.content = content;

    await newNote.save();
    res.json(newNote)
  } catch (err) {
    res.send("err add one").status(500);
  }
});

