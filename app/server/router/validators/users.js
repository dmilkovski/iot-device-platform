const Joi = require('joi')

module.exports = {
    //GET finduser
    validationFindUser: {
      params: {
        username: Joi.string().min(4).max(16).required()
      }
    },

    // GET /users/:id
    validateUserId: {
        params: {
            id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        }
    },

    // POST /users/
    validateUser: {
        body: {
            username: Joi.string().min(4).max(16).required(),
            password: Joi.string().min(6).max(16).required(),
            email: Joi.string().email().required(),
            isAdmin: Joi.boolean()
        }
    },

    // PUT /users/:id
    validateUserUpdate: {
        params: {
            id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        },
        body: {
            password: Joi.string().min(6).max(16),
            email: Joi.string().email(),
            isAdmin: Joi.boolean()
        }
    },

    // DELETE /users/:id
    validateUserDelete: {
        params: {
            id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        }
    }
}
