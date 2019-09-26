import requester from '@/vuex/utils/requester'
import jwtDecode from 'jwt-decode' 

export default {
    async login (ctx, payload){
        await requester({
            url: 'auth',
            method: 'POST',
            data: {
                username: payload.username,
                password: payload.password
            }
        }, ctx).then(data => {
            localStorage.setItem('token', data.token)
            
            // get user data
            ctx.dispatch('fetchUserInfo', {uid: jwtDecode(data.token).uid})
            
            ctx.commit('LOGIN')
        }).catch(err => {
            if (err.response.status == 401)
                ctx.commit('SET_ERROR', 'Wrong username or password')
            else 
                ctx.commit('SET_ERROR', 'Something went wrong please contact the administrator')
        })
    },
    logout (ctx) {
        localStorage.removeItem('token')
        ctx.commit('LOGOUT')
    }
}