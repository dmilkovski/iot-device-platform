const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = new Schema({
    temperature: {
        type: Number,
        required: true,
    },
    humidity: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    deviceStatus: {
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})