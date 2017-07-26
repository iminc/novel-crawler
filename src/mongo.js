const mongoose = require('mongoose')
const { mongo } = require('./config')

mongoose.Promise = global.Promise
// @ts-ignore
mongoose.connect(mongo.url, { useMongoClient: true })

module.exports = cb => {
    const db = mongoose.connection
    db.on('error', _ => { console.error(`${mongo.url} open faild...`) })
    db.once('open', async _ => {
        await cb()
        mongoose.disconnect()
    })
}
