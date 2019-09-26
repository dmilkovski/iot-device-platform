import requester from '@/vuex/utils/requester'
import jwtDecode from 'jwt-decode'

export default {
    async fetchUserInfo (ctx) {
        const uid = jwtDecode(localStorage.getItem('token')).uid
        await requester({
            url: `/resource/users/${uid}`
        }, ctx, res => res.data).then (userInfo => {
            ctx.commit('SET_USER', userInfo)
        })
    },

    fetchUserById (ctx, userId) {
        return requester({
            url: `/resource/users/${userId}`
        }, ctx, res => res.data)
    },

    async fetchUsers (ctx, payload = {}) {
        ctx.commit('SET_USERS', [])
        await requester ({
            url: `/resource/users`,
            params: {
                page: payload.page || 1,
                limit: payload.limit > 0 ? payload.limit : null
            }
        }, ctx).then (res => {
            ctx.commit('SET_USER_COUNT', res.count)
            ctx.commit('SET_USERS', res.data)
        })
    },

    async saveUser (ctx, payload){
        let userData = {
            email: payload.email,
            isAdmin: Boolean(payload.admin),
            password: payload.password || null
        }

        if (!payload.password){
            delete userData.password
        }

        await requester({
            method: 'PUT',
            url: `/resource/users/${payload.uid}`,
            data: userData
        }, ctx).then (() => {
            ctx.commit('SET_SUCCESS_MESSAGE', 'User was updated successfully')
        })
    },

    async createUser (ctx, payload = {}) {
        await requester({
            url: `/resource/users`,
            method: 'POST',
            data: {
                username: payload.username,
                password: payload.password,
                email: payload.email,
                isAdmin: Boolean(payload.isAdmin),
            }
        }, ctx).then(responseCreate => {
            // show success message
            ctx.commit('SET_SUCCESS_MESSAGE', 'User was created successfully')
        })
    },

    async deleteUser (ctx, userId) {
        await requester({
            url: `/resource/users/${userId}`,
            method: 'DELETE',
        }, ctx).then((deleteResponse) => {
            ctx.commit('SET_SUCCESS_MESSAGE', 'User was deleted successfully')
        })
    }
}