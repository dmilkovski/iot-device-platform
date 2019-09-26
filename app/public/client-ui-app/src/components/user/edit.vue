<template>
    <v-card>
        <v-card-text>
            <v-card-title class="grey--text">
                <h1>Edit user</h1>
            </v-card-title>
            <v-form ref="editForm" @submit.prevent="submit" v-model="valid">
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
                                :rules="rules.password"
                                v-model="userFields.password"
                                name="password"
                                label="Password"
                                id="password"
                                type="password"
                        />
                    </v-flex>
                </v-layout>

                <v-layout row>
                    <v-flex xs12>
                        <v-text-field
                                :rules="rules.rePassword"
                                v-model="userFields.rePassword"
                                name="rePassword"
                                label="Re-Password"
                                id="re-password"
                                type="password"
                        />
                    </v-flex>
                </v-layout>

                <v-layout row v-show="user.isAdmin && id">
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

<
<script>

    import {mapGetters, mapActions} from 'vuex'

    export default {
        name: 'UserEdit',
        props: ['id'],
        created() {
            this.fetchUserInfo().then(() => {
                if (this.id && this.user.isAdmin) {
                    this.fetchUserById(this.id).then((userInfo) => {
                        this.userFields.email = userInfo.email
                        this.userFields.admin = Number(userInfo.isAdmin)
                    })
                }
            })

        },
        watch: {
            'user': function () {
                this.userFields.email = this.user.email
                this.userFields.admin = Number(this.user.isAdmin)
            }
        },
        data() {
            return {
                valid: true,
                userFields: {
                    email: '',
                    password: null,
                    rePassword: null,
                    admin: 0
                },
                rules: {
                    email: [
                        email => !!email || 'Email is required',
                        email => /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email) || 'E-mail is not valid',
                    ],
                    password: [
                        (pass) => pass === null || pass.length >= 6 || 'Password must be grater then 6',
                        (pass) => pass === null || pass.length <= 16 || 'Password must be less then 16'
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
            ...mapActions(['fetchUserInfo', 'fetchUserById', 'saveUser']),
            submit() {
                if (this.$refs.editForm.validate()) {
                    // save
                    this.saveUser(Object.assign(this.userFields, {uid: this.id || this.user._id}))
                        .then(() => {
                            if (!this.id)
                                this.$router.push('/home')
                            else
                                this.$router.push('/users')
                        })
                        .catch((err) => {
                            this.$store.commit('SET_ERROR', err.response.data.error || 'Problem with user editing')
                        })
                }
            }
        },
        computed: {
            ...mapGetters({
                user: 'getUser',
                isLoading: 'getLoader'
            })
        }
    }
</script>
