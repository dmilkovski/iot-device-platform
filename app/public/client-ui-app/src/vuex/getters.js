export default {
    getLoader (state){
        return state.loading
    },
    getError (state) {
        return state.error
    },
    getMessage(state) {
        return state.message
    },
    getSuccessMessage (state) {
        return state.successMessage
    }
}
