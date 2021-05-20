// thêm, sửa, xoá bài viết
const postModel = require('../models/postModel')

// user tạo bài viết
const add =  (req, res) => {
    const {status, video, personName, avt} = req.body
    const {_id} = req.session.user
    let picture 
    if (!req.file) {
        picture = null
    }
    else {
        picture = req.file.filename
    }

    // lay ngay thang nam
    const event = new Date()
    time = `${event.getDate()} tháng ${event.getMonth()+1} lúc ${event.getHours()}:${event.getMinutes()}`

    // xu ly video youtube
    let url1 = 'https://www.youtube.com/watch?v='
    let url2 = 'https://youtu.be/'
    let tmp, idYoutube
    if (video.includes(url1)) {
        tmp = video.split(url1)
        idYoutube = tmp[1]
    }
    else if (video.includes(url2)) {
        tmp = video.split(url2)
        idYoutube = tmp[1]
    }
    else idYoutube = null

    // luu post
    let post = new postModel({
        idPerson: _id,
        personName,
        avt,
        status,
        picture,
        video: idYoutube,
        time
    })
    post.save()
    return res.redirect('/')
}    

// user cập nhật bài viết
const update = (req, res) => { 
    const {id} = req.params
    const {_id} = req.session.user
    const {status, video} = req.body
    let picture 
    if (!req.file) {
        picture = null
    }
    else {
        picture = req.file.filename
    }
    postModel.findOne({_id: id, idPerson: _id})
    .then(exist => {
        if (!exist) {
            return res.send('Bạn không có quyền thực hiện chức năng này')
        }
        postModel.findByIdAndUpdate(id,{
            status,
            picture,    
            video,
        }, {new: true, upsert: true})
        .then(exist => {
            if (exist) {
                return res.redirect('/')
            }
        })
        .catch(e => {
            req.flash('error', e.message)
            return res.json({message: e.message})
        })
    })
    .catch(e => {
        req.flash('error', e.message)
        return res.json({message: e.message})
    })
}

// user xoá bài viết
const Delete = (req, res) => {
    const {id} = req.params
    const {_id} = req.session.user
    postModel.findOneAndDelete({_id: id, idPerson: _id})
    .then(exist => {
        if (!exist) {
            return res.send('bạn không có quyền xoá')
        }
        return res.redirect('/')
    })
    .catch(e => {
        return res.json({message: e.message})
    })
}

module.exports = {
    add,
    update,
    Delete
}