const {check} = require('express-validator')

module.exports = [
    check('username')
    .exists().withMessage('Thiếu tên người dùng')
    .notEmpty().withMessage('Tên người dùng rỗng'),
    
    check('password')
    .exists().withMessage('Thiếu mật khẩu')
    .notEmpty().withMessage('mật khẩu rỗng')
    .isLength({min: 6}).withMessage('Mật khẩu phải từ 6 kí tự')
]