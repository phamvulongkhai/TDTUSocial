const commentModel = require('../../models/commentModel')
module.exports = isYou = (req, res, next) => {
    const idPerson = req.body.idPerson
    commentModel.findOne()
}