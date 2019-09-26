module.exports = {
    isUserAdmin: function(req) {
        if (!req.user){
            return false
        }

        return !!req.user.isAdmin
    }
}