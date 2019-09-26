<template>
    <v-card>
        <v-card-text>
            <v-layout row>
                <v-card-title class="grey--text">
                    <h1>{{createOrEditText}} device</h1>
                </v-card-title>
            </v-layout>

            <v-divider/>

            <v-form ref="createForm" @submit.prevent="submit" v-model="valid">
                <v-layout row>
                    <v-flex xs12>
                        <v-text-field
                                :rules="rules.label"
                                v-model="deviceFields.label"
                                name="label"
                                label="Device Name"
                                id="device-label"
                        />
                    </v-flex>
                </v-layout>

                <v-layout row>
                    <v-flex xs12>
                        <v-autocomplete
                                v-model="deviceFields.sharedWith"
                                :items="users"
                                :loading="contolLoading"
                                :search-input.sync="search"
                                color="white"
                                hide-selected
                                item-text="username"
                                item-value="_id"
                                label="Shared with"
                                placeholder="Start typing to Search"
                                multiple
                                chips
                                no-filter
                        >
                            
                        </v-autocomplete>
                    </v-flex>
                </v-layout>

                <v-layout row>
                    <v-flex xs12>
                        <v-text-field
                                :rules="rules.token"
                                v-model="deviceFields.token"
                                name="token"
                                label="Access Token"
                                id="device-token"
                        />
                    </v-flex>
                    <v-flex>
                        <v-btn xs4 color="error" @click="generateToken">
                            Generate token
                        </v-btn>
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
    import axios from '@/axios-instance'
    export default {
        name: 'DeviceCreate',
        props: ['id'],
        created() {
            if (typeof this.id !== "undefined") {
                this.getDevice({deviceId: this.id}).then((data) => {
                    this.deviceFields.label = data.label
                    this.deviceFields.token = data.token
                    this.deviceFields.sharedWith = data.sharedWith
                    this.entries = data.users
                })
            }
        },
        data() {
            return {
                valid: true,
                deviceFields: {
                    label: '',
                    sharedWith: [],
                    token: ''
                },
                contolLoading: false,
                search:"",
                entries: [],
                count: 0,
                rules: {
                    label: [
                        name => !!name || 'Label is required',
                        name => name === null || name.length > 3 || 'Label must be more then 3 symbols',
                        name => name === null || name.length <= 16 || 'Label must be less then 16 symbols',
                    ],
                    token: [
                        token => !!token || 'Token is required',
                        token => token.length === 32 || 'Token must be 32 characters long'
                    ]
                }
            }
        },
        methods: {
            ...mapActions({
                create: 'createDevice',
                update: 'editDevice',
                getDevice: 'fetchDeviceInfo'
            }),
            remove (item) {
                const index = this.friends.indexOf(item.name)
                if (index >= 0) this.friends.splice(index, 1)
            },
            submit() {
                if (this.$refs.createForm.validate()) {
                    if (typeof this.id === "undefined") {
                        this.create(this.deviceFields)
                    } else {
                        this.update(Object.assign(this.deviceFields, {deviceId: this.id}))
                    }
                }
            },
            generateToken() {
                var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
                var string_length = 32;
                var randomstring = '';
                for (var i = 0; i < string_length; i++) {
                    var rnum = Math.floor(Math.random() * chars.length);
                    randomstring += chars.substring(rnum, rnum + 1);
                }
                this.deviceFields.token = randomstring
            }
        },
        computed: {
            ...mapGetters({
                isLoading: 'getLoader'
            }),
            createOrEditText() {
                return !!this.id ? 'Edit' : 'Create'
            },
            users(){
                return this.entries
            }
        },
        watch: {
            search(val){
                // if (this.users.length > 0) return;
                if (this.contolLoading) return;
                if (val && val.length < 4) return;

                this.contolLoading = true;

                axios(
                    {
                        url: `resource/users/find/${val}`,
                        method: 'GET',
                    }
                ).then(res => {
                    console.log(res.data)
                    this.entries.push(...res.data.data);
                    this.count = res.data.count
                }).finally(() => this.contolLoading = false)

            }
        }
    }
</script>
