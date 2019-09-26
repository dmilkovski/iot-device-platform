const mongoose = require('mongoose')
const User = require('../models/UserModel')
const Device = require('../models/DeviceModel')

module.exports = function (baseConfig) {
    mongoose.connect(baseConfig.db.address, {
        dbName: baseConfig.db.dbName,
        user: baseConfig.db.user,
        pass: baseConfig.db.pass,
        useNewUrlParser: true // throws warning for deprecated
    })

    mongoose.set('useCreateIndex', true) // throws warning for deprecated

    mongoose.Promise = global.Promise

    const db = mongoose.connection

    db.once('open', (err) => {
        if (err) {
            console.log(`Could not open database .::${baseConfig.db.dbName}::.`)
            return
        }

        console.log(`Database up and running...`)
    })


    db.on('error', console.error.bind(console, 'MongoDB connection error:'));

    User.seedUsers()
}