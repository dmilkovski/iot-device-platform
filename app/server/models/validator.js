const Joi = require('joi')

module.exports.emailValidator = function(email) {
    // var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return Joi.valid(email, Joi.string().email().required())
}
