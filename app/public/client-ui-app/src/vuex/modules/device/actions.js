import requester from '../../utils/requester'

export default {
    async fetchAllDevices (ctx, payload) {
        await requester({
            url: `resource/devices/${payload.uid}`
        }, ctx, res => res.data).then (data => {
            ctx.commit('SET_DEVICES', data)
        })
    },
    createDevice(ctx, payload) {
        requester({
            url: 'resource/device',
            method: 'POST',
            data: {
                label: payload.label,
                sharedWith: payload.sharedWith,
                token: payload.token,
            }
        }, ctx, res => res.data).then((data) => {
            ctx.commit('SET_SUCCESS_MESSAGE', 'Device was created successfully')
        }).catch(err => {
            ctx.commit('SET_ERROR', err.response.data.error || 'Problem with creation of device')
        })
    },
    editDevice(ctx, payload) {
        requester({
            url: `resource/device/${payload.deviceId}`,
            method: 'PUT',
            data: {
                label: payload.label,
                sharedWith: payload.sharedWith,
                token: payload.token,
            }
        }, ctx, res => res.data).then((data) => {
            ctx.commit('SET_SUCCESS_MESSAGE', 'Device was updated successfully')
        }).catch(err => {
            ctx.commit('SET_ERROR', err.response.data.error || 'Problem with device editing')
        })
    },
    fetchDeviceById(ctx, payload) {
      ctx.commit('SET_DEVICE', {sensorsData: []})
        return new Promise((resolve, reject) => {
            requester({
                url: `resource/device/${payload.deviceId}`,
                method: 'GET',
                params: {
                  from: payload.from,
                  to: payload.to
                }
            }, ctx).then((res) => {
                ctx.commit('SET_DEVICE', res.data)
                resolve(res.data)
            }).catch(err => {
                ctx.commit('SET_ERROR', err.response.data.msg || 'Problem while fetching device')
            })
        })
    },
    fetchDeviceInfo(ctx, payload) {
        ctx.commit('SET_DEVICE', {sensorsData: []})
          return new Promise((resolve, reject) => {
              requester({
                  url: `resource/device/info/${payload.deviceId}`,
                  method: 'GET'
              }, ctx).then((res) => {
                  ctx.commit('SET_DEVICE', res.data)
                  resolve(res.data)
              }).catch(err => {
                  ctx.commit('SET_ERROR', err.response.data.msg || 'Problem while fetching device')
              })
          })
      },
    fetchDeviceHistoryById(ctx, payload) {
      ctx.commit('SET_DEVICE_HISTORY', [])
        return new Promise((resolve, reject) => {
            requester({
                url: `resource/device/history/${payload.deviceId}`,
                method: 'GET',
                params: {
                  from: payload.from,
                  to: payload.to
                }
            }, ctx).then((res) => {
                ctx.commit('SET_DEVICE_HISTORY', res.data.deviceHistory)
                resolve(res.data)
            }).catch(err => {
                ctx.commit('SET_ERROR', err.response.data.msg || 'Problem while fetching device')
            })
        })
    },
    deleteDevice(ctx, payload) {
        return requester({
            url: `resource/device/${payload.deviceId}`,
            method: 'Delete',
        }, ctx, res => res.data).then(() => {
            ctx.commit('SET_SUCCESS_MESSAGE', 'Device was deleted')
        }).catch(err => {
            ctx.commit('SET_ERROR', err.response.data.error || 'Problem while deleting device')
        })
    },
    changeDeviceStatus(ctx, payload){
        return requester({
            method: 'POST',
            url: `resource/device/status/${payload.token}`,
            data: {
                status: payload.status
            }
        }, ctx).then(() => {

        }).catch(err => {
            ctx.commit('SET_ERROR', err.response.data.error || 'Problem while changing status of device')
        })
    }
}
