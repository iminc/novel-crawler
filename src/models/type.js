const mongoose = require('mongoose')

const typeSchema = new mongoose.Schema({
    name: String,
    link: {
        type: String,
        unique: true,
        index: true
    },
    lastCrawlPage: String,
    lastUpdateTime: Date
})

const Type = mongoose.model('Type', typeSchema)

module.exports = Type