<template>
    <div>
        <v-alert v-show="errorMessage" type="error" :value="true">
            {{errorMessage}}
        </v-alert>
        <v-alert v-show="message" type="info" :value="true">
            {{message}}
        </v-alert>
        <v-alert v-show="successMessage" type="success" :value="true">
            {{successMessage}}
        </v-alert>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    name: 'alert',
    data() {
        return {
            counter: 0
        }
    },
    methods: {
        clearMessages() {
            this.$store.commit('SET_ERROR', false)
            this.$store.commit('SET_SUCCESS_MESSAGE', false)
            this.$store.commit('SET_MESSAGE', false)
        },

    },
    watch: {
        '$route'() {
            if (this.errorMessage || this.successMessage || this.message){
                this.counter++
            }
            if (this.counter > 1) {
                this.clearMessages()
            }
        }
    },
    computed: {
        ...mapGetters({
            errorMessage: 'getError',
            message: 'getMessage',
            successMessage: 'getSuccessMessage'
        })
    }
}
</script>
