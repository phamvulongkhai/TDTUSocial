require('dotenv').config()
const express = require('express')
const app = express()
const accountRouter = require('./routers/accountRouter')
const postRouter = require('./routers/postRouter')
const notificationRouter = require('./routers/notificationRouter')
const mongoose = require('mongoose')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('express-flash')
const dbUrl = process.env.DBURL
const postModel = require('./models/postModel')
const socketio = require('socket.io')
const path = require('path');
const checklogin = require('./controllers/check/checkLogin')
const accountStdModels = require('./models/accountStdModels')
const accountDepModels = require('./models/accountDepModels')
const notificationModels = require('./models/notificationModels')

app.use(cookieParser());
app.use(session({
    secret: "fd34s@!@dfa453f3DF#$D&W",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}))

app.use(flash())
app.use(express.static(path.join(__dirname,'public')))
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// router account
app.use('/account', accountRouter)
// router post
app.use('/post', postRouter)
// router notification
app.use('/notification', notificationRouter)

app.get('/', checklogin.isLoggedIn ,(req, res) => {
    const user = req.session.user
    const {role, fullname} = req.session.user
    boo = true
    if (role === 1) {
        accountDepModels.find({role: 2})
        .then(acc => {
            if (!acc) {
                return res.json({message: 'không có tài khoảng nào'})
            }
            return res.render('managernNoti', {user, acc})
        })
        .catch(e => {
            return res.json({message: e.message})
        })
    }
    if (role === 2) {
        notificationModels.find({idDep: user._id})
        .then(notis => {
            console.log(notis)
            if (!notis) {
                return res.json({message: 'Không tìm thấy thông báo nào'})
            }
            notis.reverse()
            return res.render('profileDep', {user, fullname, notis})
        })
        .catch(e => {
            return res.json({message: e.message})
        })
    }
    if (role === 3) {
        postModel.find({idPerson:user._id})
        .then(exist => {
            if (!exist) {
                return res.json({message: 'no post'})
            }
            exist.reverse()
            return res.render('profileStudent',{user, exist, boo, fullname})
        })
        .catch(e => {
            return res.json({message: e.message})
        })
    }
})

app.get('/phongban/:id', checklogin.isLoggedIn ,(req, res) => {
    const {id} = req.params
    const {name} = req.session.user
    notificationModels.find({idDep: id})
    .then(notis => {
        if (!notis) {
            return res.json({message: 'no post'})
        }else {
            accountDepModels.findById({_id: id})
            .then(user => {
                if (user) {
                    return res.render('profileDep', {notis, user, boo, name})
                }
            })
        } 
    })
    .catch(e => {
        return res.json({message: e.message})
    })
})

app.get('/home', checklogin.isLoggedIn,  (req, res) => {
    boo = true
    const user = req.session.user
    postModel.find()
    .then(exist => {
        if (!exist) {
            return res.json({message: 'no post'})
        }
        res.render('home', {exist, user, boo})
    })
    .catch(e => {
        return res.json({message: e.message})
    })
})

app.get('/home/:id', checklogin.isLoggedIn,  (req, res) => {
    const {id} = req.params
    let boo = false
    const {fullname} = req.session.user
    if(req.session.user._id === id)
        boo = true
    postModel.find({idPerson: id})
    .then(exist => {
        if (!exist) {
            return res.json({message: 'no post'})
        }else {
            accountStdModels.findById({_id: id})
            .then(user => {
                if (user) {
                    return res.render('profileStudent', {exist, user, boo, fullname})
                }
            })
        } 
    })
    .catch(e => {
        return res.json({message: e.message})
    })
})

app.get('/editpwd', (req, res) => {
    res.render('doimatkhau')
})

// lấy cổng từ .env hoặc 8080 nếu failed
const port  = process.env.PORT || 8080

// connect mongodb và chạy sever
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
.catch(e => console.log(e.message))

const httpServer = app.listen(port, () => console.log(`http://localhost:${port}`))
const io = socketio(httpServer)
io.on('connection', client => {
    client.on('sendNoti', (details) => {
        client.broadcast.emit('sendNotifi', details)  
    })
    client.on('disconnect', () => {
        console.log(`client ${client.id} has left`)
    })
})
