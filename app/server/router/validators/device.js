const Joi = require('joi')

const idValidation = Joi.string().regex(/^[0-9a-fA-F]{24}$/)
module.exports = {
    validateDeviceId: {
        params: {
            id: idValidation.required(),
        }
    },
    validateFilterDevice: {
        query: {
            from: Joi.date(),
            to: Joi.date()
        }
    },
    validateToken: {
        params: {
            token: Joi.string().required().length(32)
        }
    },
    validateDevice: {
        body: {
            label: Joi.string().min(4).max(16).required(),
        }
    },
    validateDeviceUpdate: {
        params: {
            id: idValidation.required()
        },
        body: {
            label: Joi.string().min(4).max(16).required(),
        }
    },
    validateChangeStatus: {
        body: {
            status: Joi.number().integer().min(0).max(1).required()
        }
    },
    validateDeviceSenstorData: {
        query: {
            t: Joi.number().required(),
            h: Joi.number().min(0).max(100).required()
        }
    }
}