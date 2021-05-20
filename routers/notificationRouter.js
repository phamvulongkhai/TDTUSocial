const express = require('express')
const router = express.Router()
const notificationController = require('../controllers/notificationController')
const checkRole = require('../controllers/check/checkRole')
const handlingUpload = require('../controllers/uploads/handlingUpload')
const checklogin = require('../controllers/check/checkLogin')

router.get('/phongban', checklogin.isLoggedIn, notificationController.phongban)
router.get('/all', checklogin.isLoggedIn, notificationController.all)
router.get('/details/:id', checklogin.isLoggedIn, notificationController.details)
router.post('/add', checklogin.isLoggedIn, checkRole.dep, handlingUpload.upload.single('image'), notificationController.add)
router.post('/update/:id' , checklogin.isLoggedIn, checkRole.dep, handlingUpload.upload.single('image'), notificationController.update)
router.post('/delete/:id', checklogin.isLoggedIn, checkRole.dep, notificationController.Delete)

module.exports = router