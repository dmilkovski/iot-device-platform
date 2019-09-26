import Vue from "vue";

export default {
    SET_DEVICES (state, devices) {
        Vue.set(state, 'devices', devices)
    },
    SET_DEVICE (state, device) {
        Vue.set(state, 'device', device)
    },
    SET_DEVICE_HISTORY (state, history) {
        Vue.set(state, 'historyData', history)
    }
}
