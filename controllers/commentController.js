// thêm, xoá comment
const commentModel = require('../models/commentModel')
const postModel = require('../models/postModel')

const add = (req, res) => {
    let {idPost, content, name} = req.body
    if (!content) {
        content = name + ' says nothing'
    }
    const {_id} = req.session.user
    let comment = new commentModel({
        idPerson: _id,
        name,
        idPost,
        content
    })
    comment.save()
    postModel.findOne({_id: idPost})
    .then(exist => {
        exist.comment.push(comment)
        exist.save()
    })
    return res.redirect('/')
}

const Delete = (req, res) => {
    const {idPost, id} = req.params
    const {_id} = req.session.user
    commentModel.findOneAndDelete({_id: id, idPerson: _id})
    .then(exist => {
        if (!exist) {
            return res.send('Bạn không thể xoá bình luận của người khác')
        }
        postModel.findById({_id: idPost})
        .then(existPost => {
            if (!existPost) {
                return res.send('Không tìm thấy post nào')
            }
            existPost.comment.forEach(cmt => {
                if (cmt._id.toString() === id) {
                    existPost.comment.remove(cmt)
                    existPost.save()
                }
            })
        })
        .catch(e => {
            req.flash('error', e.message)
            return res.json({message: e.message})
        })
        return res.redirect('/')
    })
    .catch(e => {
        return res.json({message: e.message})
    })
}

module.exports = {
    add,
    Delete
}