const mongoose = require('mongoose')
const Schema = mongoose.Schema


const AccountSchema = new Schema({
    picture: {type: String, default: null},
    name: String,
    username: {type: String, unique: true},
    password: String,
    role: {type: Number, default: 2, },
    DepName: {
        option1: {type: Boolean, default: false},
        option2: {type: Boolean, default: false},
        option3: {type: Boolean, default: false},
        option4: {type: Boolean, default: false},
        option5: {type: Boolean, default: false},
        option6: {type: Boolean, default: false},
        option7: {type: Boolean, default: false},
        option8: {type: Boolean, default: false},
        option9: {type: Boolean, default: false},
        option10: {type: Boolean, default: false},
        option11: {type: Boolean, default: false},
        option12: {type: Boolean, default: false},
        option13: {type: Boolean, default: false},
        option14: {type: Boolean, default: false},
        option15: {type: Boolean, default: false},
        option16: {type: Boolean, default: false},
        option17: {type: Boolean, default: false},
        option18: {type: Boolean, default: false},
        option19: {type: Boolean, default: false},
        option20: {type: Boolean, default: false}
    }
}, {timestamps: true})

module.exports = mongoose.model('accountDep', AccountSchema)