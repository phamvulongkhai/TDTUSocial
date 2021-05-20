const mongoose = require('mongoose')
const Schema = mongoose.Schema


const postSchema = new Schema({
    idDep: String,
    header: String,
    time: String,
    content: String,
    file: {type: String, default: null},
    DepName: Array
}, {timestamps: true})

module.exports = mongoose.model('notification', postSchema)