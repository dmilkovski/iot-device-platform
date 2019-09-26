const bodyParser = require('body-parser')
const passport = require('passport')
const path = require('path')
const expressValidation = require('express-validation')

module.exports = function (app, express) {
    // enable cross origin
    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type, Origin, Token, Content-Length, X-Requested-With, Accept');
        next()
    })
    
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

    app.use(passport.initialize())

    app.use('/', express.static(path.join(__dirname, '../../public/client-ui-app/dist')))

    //routes
    require('../router')(app, express.Router())

    // show api request info
    app.use (function (err, req, res, next) {
        if (err instanceof expressValidation.ValidationError) {
            res.status(err.status).json(err)
        }else{
            res.status(500).json({
                status: err.status,
                message: err.message
            })
        }
    })
}