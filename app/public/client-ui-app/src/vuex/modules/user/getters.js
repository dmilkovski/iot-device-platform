export default {
  getUser(state){
    return state.user
  },
  getUsers(state){
    return state.users
  },
  getUsersCount (state){
    return Number(state.usersCount)
  }
}
