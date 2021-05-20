const mongoose = require('mongoose')
const Schema = mongoose.Schema


const postSchema = new Schema({
    idPerson: String,
    personName: String,
    avt: String,
    status: String,
    picture: {type: String, default: null},
    video: String,
    time: String,
    comment: {type: Array}
}, {timestamps: true})

module.exports = mongoose.model('post', postSchema)