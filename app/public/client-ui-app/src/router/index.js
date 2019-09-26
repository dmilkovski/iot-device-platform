import Vue from 'vue';
import Router from 'vue-router';

import {store} from '../vuex/store'

// components
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';
import NotFound from '@/components/NotFound';

// routes
import Device from './modules/device'
import User from './modules/user'

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
    },
    {
      path: '/home',
      name: 'Dashboard',
      component: Dashboard,
      meta: {isAuthRequired: true}
    },
    Device,
    User,
    {
      path: '/*',
      name: 'NotFound',
      component: NotFound
    }
  ],
});

router.beforeEach ((to, from, next) => {
 // check if authentication required to proceed
 const isRequiresAuth = to.matched.some(route => route.meta.isAuthRequired)
 const isRequiresAdmin = to.matched.some(route => route.meta.isAdminRequired)

 //clear error
 store.commit('SET_ERROR', false)
 
 // prevent show login page when user is logged in
 if (to.name === 'Login' && store.getters.isLogged){
  return next('/home')
 }

 // manage user access pages with required creditionals
 if (isRequiresAuth && !store.getters.isLogged) {
  next('/')
 }

 if (isRequiresAdmin && !store.getters.getUser.isAdmin) {
  next('/')
 }

 else if (isRequiresAuth && store.getters.isLogged) {
  next()
 }
 else {
  // something bad happend
  next()
 }
})

export default router