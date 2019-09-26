const express = require('express')

const app = express()

// global api configs
const baseConfig = require('./config')

//configuration application modules
const mongooseConfig = require('./modules-config/mongoose')(baseConfig)
const expressConfig = require('./modules-config/express')(app, express)
const passportLocalConfig = require('./modules-config/passport-local')()
const passportJwtConfig = require('./modules-config/passport-jwt')(baseConfig)

app.listen(baseConfig.server.port, () => {
    console.log(`Server runs on port: ${baseConfig.server.port}`)   
});