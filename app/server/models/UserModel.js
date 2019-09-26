const mongoose = require('mongoose')
const Schema = mongoose.Schema
const emailValidator = require ('./validator').emailValidator
const crypto = require('../utils/encryption')
const defaultUser = require('../config').defaultUser

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        minlength: 4,
        maxlength: 16
        },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate: [emailValidator],
        maxlength: 254,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    salt: String,
    isAdmin: {
        type: Boolean,
        default: false
    },
    date_created: {
        type: Date,
        default: Date.now
    },
})

userSchema.method({
    authenticate (password){
        return crypto.encryptor(password, this.salt) === this.password
    }
})

const User =  mongoose.model('User', userSchema)

module.exports.seedUsers = function () {
    User.find({}).exec(function(err, collection) {
        if (err){
            console.error(`Cannot find user: ${err}`)
            return
        }

        if (collection.length === 0) {
            let salt = crypto.generateSalt()
            let hash = crypto.encryptor(defaultUser.password, salt)
            let adminUser = new User({
                username: defaultUser.username,
                password: hash,
                salt: salt,
                email: defaultUser.email,
                devices: defaultUser.devices,
                isAdmin: true
            })
            adminUser.save(function (err) {
                if (err) {
                    console.log('Problem with creation of default admin user')
                    return false;
                }

                var DeviceModel = mongoose.model('Device');
                let adminDefaultDevice = new DeviceModel({
                    label: 'Admin automatic device creation',
                    deviceOwner: adminUser._id,
                    token: '81dc9bdb52d04dc20036dbd8313ed055'
                })
                
                adminDefaultDevice.save(function (err) {
                    if (err) {
                        console.log('Problem with creation of default admin device')
                        return false;
                    }
                })
            })


            console.log(`Default user is ${defaultUser.username} with password ${defaultUser.password}`)
        }
    })
}