import Vuex from 'vuex'
import Vue from 'vue'

import Actions from './actions';
import Getters from './getters';
import Mutations from './mutations';

import User from './modules/user/'
import Device from './modules/device/'
import Authentication from './modules/authentication'

Vue.use(Vuex)

export const store = new Vuex.Store({
  actions: Actions,
  getters: Getters,
  mutations: Mutations,
  strict: true,
  state: {
    loading: false,
    error: false,
    message: false,
    successMessage: false
  },
  modules: {
    User,
    Device,
    Authentication
  }

})
