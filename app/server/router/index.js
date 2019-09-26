const AuthController = require('../controllers/AuthController')

const routes = [require('./device'), require('./user')]

module.exports = function (app, routerAPI) {
    routerAPI.use(AuthController.verifyToken)

    // ignore OPTIONS request
    app.options("/*", function(req, res, next){
        return res.status(200).send('ok')
    });
    
    // register routes for /api
    routes.forEach(routesCollection => {
        routesCollection(routerAPI)
    })

    app.use('/api/resource', routerAPI)

    // API authentication
    app.post('/api/auth', AuthController.auth)

    // default route
    app.all('/*', function (req, res, next) {
        // handle requests from vue app
        return res.redirect('/#'+req.path)
    })
}