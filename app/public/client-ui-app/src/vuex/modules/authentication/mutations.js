export default {
    LOGOUT (state){
        state.isLogged  = false
    },
    LOGIN (state) {
        state.isLogged = true
    }
}