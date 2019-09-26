module.exports = {
    storeSensorDataInterval: 15 * 60 * 1000, // ms [mm * ss * ms]
    db: {
        address: process.env.DB_ADDRESS || 'mongodb://127.0.0.1:27017/',
        user: process.env.DB_USER || '',
        pass: process.env.DB_PASS || '',
        dbName: 'SmartSocket',
    },
    server: {
        port: process.env.PORT || 3030,
        secret: process.env.SECRET || 'unicorns-are-cool',
    },
    defaultUser: {
        username: 'admin',
        password: 'admin123',
        email: 'admin@smart-socket.com',
        devices: []
    }
}