const mongoose = require('mongoose')

const novelSchema = new mongoose.Schema({
    type: String,
    name: String,
    author: String,
    status: String,
    intro: String,
    words: Number,
    link: {
        type: String,
        unique: true,
        index: true,
    },
    chapters: [{
        serial: Number,
        name: String,
        link: String,
    }],
    lastUpdateTime: Date,
})

const Novel = mongoose.model('Novel', novelSchema)

module.exports = Novel