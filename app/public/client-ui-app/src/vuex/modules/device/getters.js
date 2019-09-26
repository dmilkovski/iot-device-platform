export default {
    getDevices(store) {
        return store.devices || []
    },
    getDevice(state) {
        return state.device
    },
    getHistory(state) {
      return state.historyData
    }
}
