<template>
    <v-card>
        <v-card-text>
            <v-card-title class="grey--text">
                <h1>Sign in</h1>
            </v-card-title>
            <v-form ref="loginForm" @submit.prevent="submit" v-model="valid">
                <v-layout row>
                    <v-flex xs12>
                        <v-text-field
                                :rules="usernameRules"
                                v-model="loginFormFieldsData.username"
                                name="Username"
                                label="Username"
                                id="username"
                        />
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-flex xs12>
                        <v-text-field
                                :rules="passwordRules"
                                v-model="loginFormFieldsData.password"
                                name="Password"
                                label="Password"
                                type="password"
                                id="password"
                        />
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-layout column>
                        <v-btn type="submit" :loading="isLoading" color="success" :disabled="!valid">Sign in</v-btn>
                    </v-layout>
                    <v-layout column>
                        <v-btn color="info" @click="reset">Reset</v-btn>
                    </v-layout>
                </v-layout>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        data: () => ({
            valid: true,
            loginFormFieldsData: {
                username: '',
                password: '',
            },
            usernameRules: [
                name => !!name || 'Username is required',
                name => (name && name.length <= 16) ||
                    'Username must be less then 16 characters',
            ],
            passwordRules: [
                pass => !!pass || 'Password is required',
            ],
        }),
        methods: {
            submit() {
                if (this.$refs.loginForm.validate()) {
                    this.$store.dispatch('login', this.loginFormFieldsData).then(() => {
                        if (this.$store.getters.isLogged)
                            this.$router.push('/home')
                    })
                }
            },
            reset() {
                this.$store.commit('SET_ERROR', false)
                this.$refs.loginForm.reset();
            },
        },
        computed: {
            ...mapGetters({
                isLoading: 'getLoader'
            })
        }
    };
</script>

<style scoped>
    #test {
        border: 1px solid red;
    }
</style>
