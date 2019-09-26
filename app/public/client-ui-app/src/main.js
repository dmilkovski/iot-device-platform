// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vue from 'vue';
import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  transitions,
  VAlert,
  VCard,
  VForm,
  VSelect,
  VTextField,
  VSwitch,
  VChip,
  VDataTable,
  VAvatar,
  VDivider,
  VDialog,
  VDatePicker,
  VMenu,
  VProgressCircular,
  VProgressLinear,
  VAutocomplete
} from 'vuetify';
import Vuex from 'vuex';
import { sync } from 'vuex-router-sync'

import App from './App';
import router from './router';
import { store } from './vuex/store';
import '../node_modules/vuetify/src/stylus/app.styl';
import colors from 'vuetify/es5/util/colors'
import {mapActions, mapGetters} from 'vuex'

Vue.use(Vuetify, {
  components: {
    Vuetify,
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    transitions,
    VAlert,
    VCard,
    VForm,
    VSelect,
    VTextField,
    VSwitch,
    VChip,
    VDataTable,
    VAvatar,
    VDivider,
    VDialog,
    VDatePicker,
    VMenu,
    VProgressCircular,
    VProgressLinear,
    VAutocomplete
  },
  theme: {
    primary: colors.lightBlue.darken1,
    accent: colors.red.accent2,
    secondary: colors.grey.lighten1,
    info: colors.blue.lighten1,
    warning: colors.amber.darken2,
    error: colors.red.accent4,
    success: colors.green.lighten2,
  }
});

Vue.config.productionTip = false;

sync(store, router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  // fetch user info on incstance creation
  mounted (){
      if (this.isLogged){
          this.fetchUserInfo()
      }
  },
  methods: {
      ...mapActions([
          'fetchUserInfo'
      ])
  },
  computed: {
    ...mapGetters([
      'isLogged'
    ])
  },
});
