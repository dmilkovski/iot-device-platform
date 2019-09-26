import Vue from 'vue'

export default {
  SET_USER (state, user) {
    Vue.set(state, 'user', user)
  },
  SET_USERS (state, users) {
    Vue.set(state, 'users', users)
  },
  SET_USER_COUNT (state, count) {
    Vue.set(state, 'usersCount', count)
  }
}
