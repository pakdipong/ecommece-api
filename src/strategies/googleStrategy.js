const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

require('dotenv').config()

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/auth/google/callback",
    scope: ['email', 'profile']
},
    function (accessToken, refreshToken, profile, done) {
        const { id, emails } = profile
        const user = {
            email: emails[0].value,
            googleId: id,
            role: 'user'
        }
        return done(null, user)
    }
))

passport.serializeUser(function (user, done) {
    done(null, user)
})

passport.deserializeUser(function (user, done) {
    done(null, user)
})