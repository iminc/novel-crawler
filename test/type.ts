import mongoose from 'mongoose'

interface IType extends mongoose.Document {
    name: string
    link: string
    lastCrawlPage: string
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

export default mongoose.model<IType>('Type', typeSchema)
