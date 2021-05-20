// thêm, sửa, xoá, đăng nhập, đăng xuất, đổi mật khẩu
require('./configPassport/configPassport')
const accountDep = require('../models/accountDepModels')
const accountStd = require('../models/accountStdModels')
const addValidator = require('./validator/addValidator')
const loginValidator = require('./validator/loginValidator')
const {validationResult} = require('express-validator')
const passport = require('passport')
const bcrypt = require('bcrypt')

// sinh viên đăng nhập bằng tài khoản sinh viên 

const authAndScope =   passport.authenticate('google', { scope:['email', 'profile' ] })
const authAndRedir  = [passport.authenticate('google', {
    failureRedirect: 'http://localhost:8888/account/failed'
}), (req, res) => {
    const email = req.user._json.email
    accountStd.findOne({email})
    .then(acc => {
        if (!acc) {
            return res.redirect('/account/auth/google')
        }
        req.session.user = {
            fullname: acc.fullname,
            Class: acc.Class,
            picture: acc.picture,
            faculty: acc.faculty,
            role: acc.role,
            _id: acc._id
        }
        return res.redirect('/')
    })
    .catch(e => {
        console.log(e.message)
    })
}]

// phòng/khoa đăng nhập bằng tài khoản admin cung cấp
const loginGet = (req, res) => {
    if (req.session.user) {
        return res.redirect('/')
    }
    let error = req.flash('error')
    res.render('login', {error})
}

const loginPost = [loginValidator, (req, res) => {
    let result = validationResult(req)
    if (result.errors.length === 0) {
        const {username, password} = req.body
        accountDep.findOne({username})
        .then(acc => {
            if (!acc) {
                req.flash('error', 'Tài khoản không tồn tại')
                return res.redirect('/account/login')
            }
            req.session.user = {
                user: acc.username,
                picture: acc.picture,
                name: acc.name,
                role: acc.role,
                _id: acc._id
            }
            return bcrypt.compare(password, acc.password)
        })
        .then(passwordMatch => {
            if (!passwordMatch) {
                req.flash('error', 'Mật khẩu không khớp')
                return res.status(401).send('mật khẩu không khớp')
            }     
            return res.redirect('/')
        })
        .catch(e => {
            return res.json({message: e.message})
        })
    }
    else {
        let messages = result.mapped()
        let message = ''
        for (m in messages) {
            message = messages[m]   
            break
        }
        req.flash('error', result.errors[0].msg)
        return res.redirect('/account/login')
    }
}]

// admin thêm tài khoản phòng/khoa
const add = [addValidator, (req, res) => {
    let result = validationResult(req)
    if (result.errors.length === 0) {
        const {username, password, name} = req.body
        const hashed = bcrypt.hashSync(password, 10)
        let user = new accountDep({
            name,
            username: username,
            password: hashed,
        })
        user.save()
        return res.redirect('/')
    }
    let messages = result.mapped()
    let message = ''
    for (m in messages) {
        message = messages[m]   
        break
    }
    return res.json({message: message})
}]

// admin phân quyền đăng bài cho phòng khoa
const setRoleNoti = (req, res) => {
    const {id} = req.params
    const DepName1 = Object.keys(req.body)
    let DepName = {
        option1: false,
        option2: false,
        option3: false,
        option4: false,
        option5: false,
        option6: false,
        option7: false,
        option8: false,
        option9: false,
        option10: false,
        option11: false,
        option12: false,
        option13: false,
        option14: false,
        option15: false,
        option16: false,
        option17: false,
        option18: false,
        option19: false,
        option20: false
    }
    DepName1.forEach(p => {
        DepName[p] = true
    })
    accountDep.findByIdAndUpdate(id,
        {DepName},
        {new: true, upsert: true}
    )
    .then(exist => {
        if (!exist) {
            return res.send('Thêm tài khoản thành công')
        }
        return res.redirect('/')
    })
    .catch(e => {
        return res.json({message: e.message})
    })
}

// phòng/khoa có thể đổi mật khẩu mặc định
const changePass = (req, res) => {
    const {id} = req.params
    const {password} = req.body
    accountDep.findByIdAndUpdate(id,
        {password},
        {new: true, upsert: true}
    )
    .then(exist => {
        if (!exist) {
            return res.send('Không tìm thấy tài khoản')
        }
        return res.redirect('/')
    })
    .catch(e => {
        return res.json({message: e.message})
    })
}

// sinh viên có thể thay đổi thông tin cá nhân
const updateInfo = (req, res) => {
    const {id} = req.params
    const {fullname, Class, faculty} = req.body
    accountStd.findByIdAndUpdate(id, 
        {
            fullname,
            Class,
            faculty,
        },
        {new: true, upsert: true}
    )
    .then(exist => {
        if (!exist) {
            return res.send('Không tìm thấy tài khoản')
        }
        return res.redirect('/')
    })
    .catch(e => {
        return res.json({message: e.message})
    })
}

const Delete = (req, res) => {
    const {id} = req.params
    accountDep.findOne({_id: id})
    .then(exist => {
        if (!exist) {
            return res.send('Không tìm thấy tài khoản')
        }
        return res.redirect('/')
    })
    .catch(e => {
        return res.json({message: e.message})
    })
}

// đăng xuất
const logout = (req, res) => {
    req.session.destroy()
    res.redirect('/account/login')
}

const failed = (req, res) => { res.render('failed')}

module.exports = {
    add,
    changePass,
    Delete,
    loginGet,
    loginPost,
    logout,
    authAndScope,
    authAndRedir,
    setRoleNoti,
    updateInfo,
    failed
}