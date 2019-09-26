const DeviceController = require('../controllers/DeviceController')
const validation = require('express-validation')
const rules = require('./validators/device')

module.exports = function (router){

    // router.get('/device/:id', [validation(rules.validateDeviceId)])
    router.get('/devices/:id', [validation(rules.validateDeviceId)], DeviceController.getAllUserDevices)
    router.get('/device/:id', [validation(rules.validateDeviceId)], DeviceController.getDeviceById)
    router.get('/device/info/:id', [validation(rules.validateDeviceId)], DeviceController.getDeviceInfo)
    router.get('/device/history/:id', [validation(rules.validateDeviceId)], DeviceController.getDeviceHistory)
    router.post('/device', validation(rules.validateDevice), DeviceController.createDevice)
    router.put('/device/:id', validation(rules.validateDeviceUpdate), DeviceController.editDevice)
    router.delete('/device/:id', validation(rules.validateDeviceId), DeviceController.removeDevice)

    router.get('/device/status/:token', validation(rules.validateToken), DeviceController.getDeviceStatus)
    router.post('/device/status/:token', [validation(rules.validateToken), validation(rules.validateChangeStatus)], DeviceController.changeDeviceStatus)
    router.get('/device/sensor/store/:token', [rules.validateToken, rules.validateDeviceSenstorData].map(i => validation(i)), DeviceController.storeSensorData)
    return router
}
