const express = require('express')
const router = express.Router()
const accountController = require('../controllers/accountController')
const passport = require('passport')
const checklogin = require('../controllers/check/checkLogin')
const checkRole = require('../controllers/check/checkRole')


router.use(passport.initialize())
router.use(passport.session())

router.post('/add', checklogin.isLoggedIn, checkRole.admin, accountController.add)
router.post('/update-pasword/:id', checklogin.isLoggedIn, checkRole.dep, accountController.changePass)
router.post('/update-role/:id', checklogin.isLoggedIn, checkRole.admin, accountController.setRoleNoti)
router.post('/update-info/:id', checklogin.isLoggedIn, checkRole.std , accountController.updateInfo)
router.get('/failed', accountController.failed)
router.get('/login', accountController.loginGet)
router.post('/login', accountController.loginPost)
router.get('/logout', accountController.logout)
router.get('/auth/google',checklogin.isLoggedGG, accountController.authAndScope)
router.get('/google/callback', accountController.authAndRedir)
router.delete('/delete/:id', checklogin.isLoggedIn, checkRole.admin, accountController.Delete)

module.exports = router