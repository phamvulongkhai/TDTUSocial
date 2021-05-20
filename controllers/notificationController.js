// thêm, sửa, xoá thông báo
const e = require('express')
const accountDepModel = require('../models/accountDepModels')
const notificationModel = require('../models/notificationModels')

// phòng khoa đăng thông báo
const add = (req, res) => {
    var DepName = Object.keys(req.body)
    DepName.splice(0,2)
    const {header, content} = req.body
    const {_id} = req.session.user
    let picture 
    if (!req.file) {
        picture = null
    }
    else {
        picture = req.file.filename
    }

    const event = new Date()
    time = `${event.getDate()} tháng ${event.getMonth()+1} lúc ${event.getHours()}:${event.getMinutes()}`

    let noti = new notificationModel({
        idDep: _id,
        header,
        content,
        file: picture,
        DepName,
        time
    })
    noti.save()
    return res.redirect('/')
}

// phòng khoa cập nhập thông báo
const update = (req, res) => { 
    const {id} = req.params
    const {_id} = req.session.user
    const {header, content, file} = req.body
    notificationModel.findOne({_id: id, idDep: _id})
    .then(exist => {
        if (!exist) {
            req.flash('error', 'Bạn không có quyền thực hiện chức năng này')
            return res.send('Bạn không có quyền thực hiện chức năng này')
        }
        notificationModel.findByIdAndUpdate(id, {
            header,
            content,    
            file,
        }, {new: true, upsert: true})
        .then(exist => {
            if (exist) {
                req.flash('done', 'Cập nhật thông báo thành công')
                return res.send('Cập nhật thông báo thành công')
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

// phòng khoa xoá thông báo
const Delete = (req, res) => {
    const {id} = req.params
    const {_id} = req.session.user
    notificationModel.findOne({_id: id, idDep: _id})
    .then(exist => {
        if (!exist) {
            return res.send('Bạn không có quyền xoá')
        }
        return res.redirect('/')
    })
    .catch(e => {
        req.flash('error', e.message)
        return res.json({message: e.message})
    })
}

const phongban = (req, res) => {
    const user = req.session.user
    accountDepModel.find()
    .then(dep => {
        if (!dep) {
            return res.json({message: e.message})
        }
        dep.reverse()
        return res.render('danhsachphongban', {dep, user})
    })
}

const all = (req, res) => {
    const user = req.session.user
    notificationModel.find()
    .then(notis => {
        if (!notis) {
            return res.json({message: e.message})
        }
        return res.render('allnoti', {notis, user})
    })
}

const details = (req, res) => {
    const {id} = req.params
    const user = req.session.user
    notificationModel.findById({_id: id})
    .then(noti => {
        if (!noti) {
            return res.json({message: e.message})
        }
        return res.render('chitietthongbao', {noti, user})
    })
}

module.exports = {
    add,
    update,
    Delete,
    phongban,
    all,
    details
}