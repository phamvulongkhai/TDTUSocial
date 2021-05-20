const admin = (req, res, next) => {
    const {role} = req.session.user 
    if (role === 1) {
        next()
    }
    else {
        req.flash('err', 'Bạn không có quyền truy cập')
        return res.send('not ok')
    }
}

const dep = (req, res, next) => {
    const {role} = req.session.user 
    if (role === 2) {
        next()
    }
    else {
        req.flash('err', 'Bạn không có quyền truy cập')
        return res.send('not ok')
    }
}

const std = (req, res, next) => {
    const {role} = req.session.user 
    if (role === 3) {
        next()
    }
    else {
        req.flash('err', 'Bạn không có quyền truy cập')
        return res.send('not ok')
    }
}

module.exports  = {
    admin,
    dep,
    std,
}