import axios from '@/axios-instance'

export default (options, ctx, callback) => {
    ctx.commit('SET_LOADING', true)
    ctx.commit('SET_ERROR', false)
    return axios(options).then((response) => {
        let data = response.data
        if (callback){
            data = callback(data)
        }
        
        ctx.commit('SET_LOADING', false)
        return Promise.resolve(data)
        
    }).catch((err) => {
        ctx.commit('SET_LOADING', false, {root: true})
        ctx.commit('SET_ERROR', err.response.data.statusText, {root: true})
        return Promise.reject(err)
    })
}