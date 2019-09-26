<template>
    <v-app fill-height>
        <app-header/>
        <v-container fill-height align-content-center fluid p0>
            <v-layout row>
                <v-layout column justify-center>
                    <alert/>
                    <router-view :key="$route.fullPath"></router-view>
                </v-layout>
            </v-layout>
        </v-container>
        <app-footer/>
    </v-app>
</template>

<script>
    import Vue from 'vue'
    import {mapActions, mapGetters} from 'vuex'

    import Header from './components/template/Header'
    import Footer from './components/template/Footer'
    import Alert from './components/shared/Alert'

    Vue.component('app-header', Header)
    Vue.component('app-footer', Footer)

    export default {

        data() {
            return {
                sideNav: false,
            };
        },
        components: {
            Alert
        },
        name: 'App',
    };
</script>
