const UserModel = require('mongoose').model('User')
const encryption = require('../utils/encryption')
const authentication = require('../utils/authentication')

module.exports = {
    findUsers: function (req, res, next) {
      let queryFieldsExclusion = [
        "-isAdmin",
        "+_id",
         "+username",
         "-password",
         "-salt",
         "-email",
         "-date_created",
         "-__v"
       ]

      UserModel.find({username: new RegExp(req.params.username, "i")}).where("_id").ne(req.user._id).select(queryFieldsExclusion.join(' ')).exec(function(err, result) {

        return res.json({
          data: result,
          count: result.length
        })
      });
    },
    getAllUsers: function (req, res, next) {
        if (!authentication.isUserAdmin(req)) {
            return res.status(401).send({
                msg: 'You are not authorized to perform this action'
            })
        }
        let limit = Number(req.query.limit || 0)
        let page = Number(req.query.page || 1) - 1

        let queryFieldsExclusion = {
            password: false,
            salt: false,
            __v: false
        }

        UserModel.find({}, queryFieldsExclusion).limit(limit).skip(page * limit).exec(async function (err, data) {
            if (err) {
                console.log(`Error retrive users colletion: ${err}`)
            }

            return res.json({
                data,
                count: await UserModel.countDocuments(),
                limit
            })
        })
    },
    getUserById: function (req, res, next) {
        if (req.user._id.toString() !== req.params.id && !authentication.isUserAdmin(req)) {
            return res.status(401).send({
                msg: 'You are not authorized to perform this action'
            })
        }

        let payload = req.params

        let queryFieldsExclusion = {
            password: false,
            salt: false,
            __v: false

        }

        UserModel.findOne({
            _id: payload.id.toString()
        }, queryFieldsExclusion).exec(function (err, user) {
            if (err) {
                console.log(`Error retrive user: ${err}`)
            }

            if (!user) {
                return res.status(404).json({
                    msg: `No user found`
                })
            }

            res.json({
                data: user
            }).end()
        })
    },
    createUser: function (req, res, next) {
        if (!authentication.isUserAdmin(req)) {
            return res.status(401).send({
                msg: 'You are not authorized to perform this action'
            })
        }

        let userData = req.body
        let salt = encryption.generateSalt()
        let passwordHash = encryption.encryptor(userData.password, salt)

        UserModel.create({
            username: userData.username,
            password: passwordHash,
            salt: salt,
            email: userData.email,
            isAdmin: userData.isAdmin
        }).then((user) => {
            return res.json(user)
        }).catch((err) => {
            let error = ""
            if (err.message.includes('E11000')) {

                if (err.message.includes('email')) {
                    error = 'This email is already in use';
                } else if (err.message.includes('username')) {
                    error = 'This username is already in use';
                } else {
                    error = 'Duplicate Key Entry';
                }

                return res.status(409).json({
                    error
                })
            }

            res.status(400).json({
                error: err
            })
        })

    },
    editUser: function (req, res, next) {
        if (req.user._id.toString() !== req.params.id && !authentication.isUserAdmin(req)) {
            return res.status(401).send({
                msg: 'You are not authorized to perform this action'
            })
        }

        let userData = req.body

        if (!authentication.isUserAdmin(req)) {
            delete userData.isAdmin
            delete userData.username
            delete userData.date_created
        }

        if (userData.password) {
            userData['salt'] = encryption.generateSalt()
            userData.password = encryption.encryptor(userData.password, userData.salt)
        }

        UserModel.findOneAndUpdate({
                _id: req.params.id
            }, userData, {
                new: true
            }).exec()
            .then(updatedUser => res.send(updatedUser))
            .catch((err) => {
                let error = ""
                if (err.message.includes('E11000')) {

                    if (err.message.includes('email')) {
                        error = 'This email is already in use';
                    } else if (err.message.includes('username')) {
                        error = 'This username is already in use';
                    } else {
                        error = 'Duplicate Key Entry';
                    }

                    return res.status(409).json({
                        error
                    })
                }

                return res.status(400).json({
                    error: err
                })
            })
    },
    deleteUser: function (req, res, next) {
        if (!authentication.isUserAdmin(req)) {
            return res.status(401).send({
                msg: 'You are not authorized to perform this action'
            })
        }

        UserModel.findByIdAndRemove({
            _id: req.params.id
        }).then((deletedUser) => {
            if (!deletedUser) {
                return res.status(404).send({
                    msg: "No user found"
                })
            }
            return res.send({
                data: deletedUser
            })
        }).catch((err) => {
            return res.status(400).send({
                error: err
            })
        })
    }
}
