const passport = require('passport')
const PassportLocal = require('passport-local').Strategy
const UserModel = require('mongoose').model('User')

module.exports = function (){
    const options = {
        usernameField: 'username',
        passwordField: 'password',
        session: false
    }
    
    const verify = function (username, password, done){
        UserModel.findOne({username}).exec(function(err, user) {
            if (err){
                console.log(`Error loading user: ${err}`)
                return
            }

            if (user && user.authenticate(password)){
                return done (null, user)
            }
            else {
                return done (null, false)
            }
        })
    }

    const localStratergy = new PassportLocal(options, verify)
    
    passport.use(localStratergy)
}