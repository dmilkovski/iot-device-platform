const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SensorDataSchema = require('./SensorDataSchema')
const DeviceHistorySchema = require('./DeviceStatusHistorySchema')

const DeviceSchema = new Schema({
    //add device token for authentication
    label: {
        type: String,
        min: 3,
        max: 16,
        required: true
    },
    statusNow: { // on or off
        type: Boolean,
        default: false,
    },
    token: {
      type: String,
      required: true,
      unique: true,

    },
    sensorsData: [SensorDataSchema],
    deviceHistory: [DeviceHistorySchema],
    deviceOwner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }]
})

mongoose.model('Device', DeviceSchema)