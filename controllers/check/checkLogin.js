const isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/account/login')
    }
    next()
}

const isLoggedGG = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/')
    }
    next()
}

module.exports = {isLoggedIn, isLoggedGG}
