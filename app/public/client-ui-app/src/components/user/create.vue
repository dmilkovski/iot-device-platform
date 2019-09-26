<template>
    <v-card>
        <v-card-text>
            <v-card-title class="grey--text">
                <h1>Create user</h1>
            </v-card-title>
            <v-form ref="createForm" @submit.prevent="submit" v-model="valid">
                <v-layout row>
                    <v-flex xs12>
                        <v-text-field
                                :rules="rules.username"
                                v-model="userFields.username"
                                name="username"
                                label="Username"
                                id="username"
                        />
                    </v-flex>
                </v-layout>

                <v-layout row>
                    <v-flex xs12>
                        <v-text-field
                                :rules="rules.email"
                                v-model="userFields.email"
                                name="email"
                                label="E-mail"
                                id="email"
                        />
                    </v-flex>
                </v-layout>

                <v-layout row>
                    <v-flex xs12>
                        <v-text-field
                                type="password"
                                :rules="rules.password"
                                v-model="userFields.password"
                                name="password"
                                label="Password"
                                id="password"
                        />
                    </v-flex>
                </v-layout>

                <v-layout row>
                    <v-flex xs12>
                        <v-text-field
                                type="password"
                                :rules="rules.rePassword"
                                v-model="userFields.rePassword"
                                name="rePassword"
                                label="Re-Password"
                                id="re-password"
                        />
                    </v-flex>
                </v-layout>

                <v-layout row>
                    <v-flex xs12>
                        <v-select
                                name="isAdmin"
                                :rules="rules.admin"
                                :items="[
                                    {title: 'No', val: 0},
                                    {title: 'Yes', val: 1}
                                ]"
                                item-text="title"
                                item-value="val"
                                v-model="userFields.admin"
                                label="Is User Administrator"
                        ></v-select>
                    </v-flex>
                </v-layout>

                <v-layout row>
                    <v-layout column>
                        <v-btn type="submit" :loading="isLoading" color="success" :disabled="!valid">Save</v-btn>
                    </v-layout>

                    <v-layout column>
                        <v-btn color="info" @click="$router.go(-1)">Cancel</v-btn>
                    </v-layout>
                </v-layout>
            </v-form>
        </v-card-text>
    </v-card>
</template>
<script>

    import {mapGetters, mapActions} from 'vuex'

    export default {
        name: 'UserCreate',
        data() {
            return {
                valid: true,
                userFields: {
                    username: '',
                    email: '',
                    password: '',
                    rePassword: '',
                    admin: 0
                },
                rules: {
                    username: [
                        username => !!username || 'Username is required',
                        username => username.length > 4 || 'Usernmae must be greated then 4 symbols',
                        username => username.length < 16 || 'Username must be less then 16 symbols'
                    ],
                    email: [
                        email => !!email || 'Email is required',
                        email => /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email) || 'E-mail is not valid'
                    ],
                    password: [
                        (pass) => !!pass && pass.length >= 6 || 'Password must be grater then 4',
                        (pass) => !!pass && pass.length <= 16 || 'Password must be less then 16'
                    ],
                    rePassword: [
                        (pass) => pass === this.userFields.password || 'Password must match'
                    ],
                    admin: [
                        (admin) => admin !== '' || 'Please select privilages of user'
                    ]
                }
            }
        },
        methods: {
            ...mapActions(['createUser']),
            submit() {
                if (this.$refs.createForm.validate()) {
                    this.createUser({
                        username: this.userFields.username,
                        password: this.userFields.password,
                        email: this.userFields.email,
                        isAdmin: this.userFields.admin,
                    }).then(() => {
                      this.$router.push('/users')
                    }).catch(err => {
                        this.$store.commit('SET_ERROR', err.response.data.error || 'Problem with creation of user')
                    })
                }
            }
        },
        computed: {
            ...mapGetters({
                isLoading: 'getLoader'
            })
        }

    }
</script>
