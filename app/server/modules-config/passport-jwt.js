const passport  = require('passport')
const PassportJWT = require('passport-jwt').Strategy
const JwtExtractor = require('passport-jwt').ExtractJwt
const UserModel = require('mongoose').model('User')

module.exports = function (basicConfig){
    const options = {
        jwtFromRequest: JwtExtractor.fromExtractors([
            JwtExtractor.fromHeader('token'),
            JwtExtractor.fromBodyField('token'),
            JwtExtractor.fromUrlQueryParameter('token'),
        ]),
        secretOrKey: basicConfig.server.secret,
        ignoreExpiration: true,
    }
    
    const verify = function (jwtPayload, done){
        UserModel.findOne({_id: jwtPayload.uid}, function(err, user) {
            if (err) {
                return done(err, false);
            }
            
            if (user) {
                return done(null, user);
            } else {
                return done(null, false, {logged: false});
            }
        });
    }

    const jwtStratergy = new PassportJWT(options, verify)
    
    passport.use(jwtStratergy)
}