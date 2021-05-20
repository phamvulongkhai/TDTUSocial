const { CLIENTIDGOOGLE, CLIENTSECRETGOOGLE, CALLBACKURLGG} = process.env
const passport = require('passport')
const googleStrategy = require('passport-google-oauth20').Strategy
const accountStd = require('../../models/accountStdModels')

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user);
})

passport.use(new googleStrategy({
        clientID: CLIENTIDGOOGLE,
        clientSecret: CLIENTSECRETGOOGLE,
        callbackURL: CALLBACKURLGG,
        passReqToCallback:true
    },(request, accessToken, refreshToken, profile, done) => {
        // check mail sinh viên
        const checkSuffixes = 'student.tdtu.edu.vn'
        const checkVerfied = true
        // console.log(profile)
        if (profile._json.hd === checkSuffixes  && profile._json.email_verified === checkVerfied) {
            const {email, name, picture} = profile._json
            // lưu vào db
            accountStd.findOne({email: email})
            .then(acc => {
                if (!acc) {
                    let user = new accountStd({
                        email: email,
                        fullname: name,
                        picture: picture
                    })
                    user.save()
                }
                return done(null, profile)
            })  
        } else {
            return done(null, false)
        }
    }
))

