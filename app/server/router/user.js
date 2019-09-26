const UserController = require('../controllers/UserController')
const validation = require('express-validation')
const rules = require('./validators/users')

module.exports = function (router){
    router.get('/users/find/:username', [validation(rules.validationFindUser)], UserController.findUsers)
    router.get('/users', UserController.getAllUsers)
    router.get('/users/:id', [validation(rules.validateUserId)], UserController.getUserById)

    router.post('/users', [validation(rules.validateUser)], UserController.createUser)
    router.put('/users/:id', [validation(rules.validateUserUpdate)], UserController.editUser)
    router.delete('/users/:id', UserController.deleteUser)
}
