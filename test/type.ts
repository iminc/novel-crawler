import mongoose from 'mongoose'

interface IType extends mongoose.Document {
    name: string,
    link: string,
    lastCrawlPage: string,
    lastUpdateTime: Date
}

const typeSchema: mongoose.Schema = new mongoose.Schema({
    name: String,
    link: {
        type: String,
        unique: true,
        index: true
    },
    lastCrawlPage: String,
    lastUpdateTime: Date
})

const Type = mongoose.model<IType>('Type', typeSchema)
const type = new Type()
type.name = '1'

console.log(type.name)
