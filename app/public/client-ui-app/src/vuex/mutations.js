export default {
    SET_LOADING (state, status) {
        state.loading = status
    },
    SET_ERROR (state, error) {
        state.error = error
    },
    SET_MESSAGE (state, message) {
        state.message = message
    },
    SET_SUCCESS_MESSAGE (state, successMessage) {
        state.successMessage = successMessage
    }
}
