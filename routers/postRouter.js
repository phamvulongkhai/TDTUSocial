const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')
const commentController = require('../controllers/commentController')
const checkRole = require('../controllers/check/checkRole')
const handlingUpload = require('../controllers/uploads/handlingUpload')
const checkLogin = require('../controllers/check/checkLogin')

// them middleware cho /add , checkRole.std 
router.post('/add', checkLogin.isLoggedIn, handlingUpload.upload.single('image'), postController.add)
router.post('/update/:id', checkLogin.isLoggedIn, checkRole.std,  handlingUpload.upload.single('image'), postController.update)
router.get('/delete/:id', checkLogin.isLoggedIn, checkRole.std, postController.Delete)
router.post('/comment',checkRole.std, checkLogin.isLoggedIn, commentController.add)
router.get('/delete/:idPost/:id', checkLogin.isLoggedIn, checkRole.std, commentController.Delete)

module.exports = router