const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    dateTurnOn: {
        type: Date,
        default: Date.now
    },
    dateTurnOff: {
        type: Date,
    },

})