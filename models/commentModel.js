const mongoose = require('mongoose')
const Schema = mongoose.Schema


const postSchema = new Schema({
    name: String,
    idPerson: String,
    idPost: String,
    content: String
}, {timestamps: true})

module.exports = mongoose.model('comment', postSchema)