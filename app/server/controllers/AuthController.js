const passport = require('passport')
const jwt = require('jsonwebtoken')
const baseConfig = require('../config')

module.exports = {
    auth: function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            if (err) {
                return res.sendStatus(400).json({
                    msg: 'Something went wrong',
                    error: err
                })
            }
            if (!user){
                return res.status(401).json({logged: false})
            }

            req.login(user, {session: false}, (err) => {
                if (err) {
                    res.status(400).send(err);
                }

                // sign token
                const token = jwt.sign({uid: user._id}, baseConfig.server.secret)
                
                // send it to user
                return res.json({logged: true, token})
            });

        })(req, res, next)
    },
    verifyToken: function (req, res, next) {
        if (req.method.toLowerCase() === "get") {
            if (req.path.toString().includes('device/sensor/store') || req.path.toString().includes('device/status')) {
                return next()
            }
        }

        return passport.authenticate('jwt', { session: false })(req, res, next)
    },
}