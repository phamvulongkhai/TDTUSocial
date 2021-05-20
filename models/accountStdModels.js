const mongoose = require('mongoose')
const Schema = mongoose.Schema


const AccountSchema = new Schema({
    email:{
        type: String,
        unique: true
    },
    fullname: {type: String, default: null},
    picture: {type: String, default: null},
    Class: {type: Number, default: null},
    faculty: {type: String, default: null},
    role: {type: Number, default: 3}
}, {timestamps: true})

module.exports = mongoose.model('accountStd', AccountSchema)