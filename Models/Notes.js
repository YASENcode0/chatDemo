const mongoose = require("mongoose");

const Note = mongoose.Schema({
    __id:String,
    content:String
})

module.exports = mongoose.model("note", Note);