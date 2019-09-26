<template>
    <v-card>
        <v-card-text>
            <v-card-title primary-title class="grey--text">
                <v-layout row>
                    <v-flex xs11>
                        <h2>Devices information</h2>
                    </v-flex>
                    <v-flex justify-space-between>
                        <v-btn to="/device/create" color="green" dark>Add Device</v-btn>
                    </v-flex>
                </v-layout>
            </v-card-title>
            <v-layout row>
                <v-flex>
                    <v-text-field @input="doFilterDevices"
                                  id="filter-devices" name="input-1"
                                  v-model="filterVal"
                                  label="Filter Devices"/>
                </v-flex>
            </v-layout>
            <v-card-title v-show="!devicesFiltered.length">
                No devices found
            </v-card-title>
            <v-card class="mt-3" v-for="(device, deviceKey) in devicesFiltered" :key="deviceKey">
                <v-card-title>
                    <h2 class="grey--text text--lighten-1 text-truncate">{{device.label}}</h2>
                    <v-spacer />
                    <v-card-actions>
                        <v-btn v-show="device.deviceOwner._id === user._id" fab dark small color="light-green"
                               :to="{ name: 'DeviceEdit', params: {id: device._id} }">
                            <v-icon>edit</v-icon>
                        </v-btn>
                        <v-btn fab dark small color="light-blue accent-3"
                               :to="{ name: 'DeviceInfo', params: {id: device._id} }">
                            <v-icon>info</v-icon>
                        </v-btn>
                        <v-btn v-show="device.deviceOwner._id === user._id" fab dark small color="red"
                               @click="removeDevice(device)">
                            <v-icon>delete_forever</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card-title>
                <v-divider/>
                <v-list>
                    <v-list-tile>
                        <v-list-tile-content>
                            <v-list-tile-title><span class="body-1">Status</span></v-list-tile-title>
                        </v-list-tile-content>

                        <v-list-tile-action>
                            <v-flex>
                                <v-switch :loading="isLoading" color="blue" @change.self="changeStatus($event, device)"
                                          v-model.stop="device.statusNow"></v-switch>
                            </v-flex>
                        </v-list-tile-action>
                    </v-list-tile>

                    <v-list-tile>
                        <v-list-tile-content>
                            <v-list-tile-title><span class="body-1">Tempereture</span></v-list-tile-title>
                        </v-list-tile-content>

                        <v-list-tile-action>
                            <v-chip color="green" text-color="white">
                                {{formatSensorData(device).temperature}} &#8451;
                            </v-chip>
                        </v-list-tile-action>
                    </v-list-tile>

                    <v-list-tile>
                        <v-list-tile-content>
                            <v-list-tile-title><span class="body-1">Humidity</span></v-list-tile-title>
                        </v-list-tile-content>

                        <v-list-tile-action>
                            <v-chip color="red darken-3" text-color="white">
                                {{formatSensorData(device).humidity}}%
                            </v-chip>
                        </v-list-tile-action>
                    </v-list-tile>

                    <v-list-tile v-if="formatSensorData(device).date">
                        <v-list-tile-content>
                            <v-list-tile-title><span class="body-1">Last updated tempereture info</span></v-list-tile-title>
                        </v-list-tile-content>
                        
                        <v-list-tile-action>
                            <v-chip color="yellow darken-3" text-color="white">
                                {{new Date(formatSensorData(device).date).toLocaleString()}}
                            </v-chip>
                        </v-list-tile-action>
                    </v-list-tile>

                    <v-list-tile>
                        <v-list-tile-content>
                            <v-list-tile-title><span class="body-1">Token</span></v-list-tile-title>
                        </v-list-tile-content>
                        <v-spacer/>
                        <v-list-tile-action>
                            <v-dialog width="500">
                                <v-btn round slot="activator" color="light-blue accent-2" dark @click="generateQr(deviceKey, device.token)">Show</v-btn>
                                <v-card>
                                    <v-card-title class="headline blue lighten-1 white--text" primary-title>Token for
                                        {{device.label}}
                                    </v-card-title>
                                    <v-card-text class="body-2 text-xs-center">
                                      <span :id="device.token">{{device.token}}</span>
                                      <v-spacer />
                                      <canvas :ref="`qr-${deviceKey}`"></canvas>
                                    </v-card-text>
                                </v-card>
                            </v-dialog>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list>
            </v-card>
        </v-card-text>
    </v-card>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import qrcode from 'qrcode'

    export default {
        name: 'Dashboard',
        data() {
            return {
                filterVal: '',
                deviceListLocal: []
            }
        },
        computed: {
            ...mapGetters({
                devicesList: 'getDevices',
                user: 'getUser',
                isLoading: 'getLoader'
            }),
            devicesFiltered() {
                return this.doFilterDevices()
            }
        },
        watch: {
            user: {
                immediate: true,
                handler: function (newVal, oldVal) {
                    if (this.user._id) {
                        this.$store.dispatch('fetchAllDevices', {uid: this.user._id})
                    }
                }
            },
            devicesList: {
                deep: true,
                handler(newVal, oldVal) {
                    this.$set(this, 'deviceListLocal', JSON.parse(JSON.stringify(newVal)))
                }
            }
        },
        methods: {
            ...mapActions({
                delete: 'deleteDevice',
                changeDeviceStatus: 'changeDeviceStatus'
            }),
            doFilterDevices() {
                let pattern = new RegExp(this.filterVal, 'i')

                return this.deviceListLocal.filter((device) => {
                    return pattern.test(device.label)
                })
            },
            removeDevice(device) {
                let result = confirm(`Do you want to delete "${device.label}" device?`)

                if (result) {
                    this.delete({deviceId: device._id}).then(() => {
                        this.$store.dispatch('fetchAllDevices', {uid: this.user._id}).then(() => {
                            this.$forceUpdate()
                        })
                    })
                }
            },
            changeStatus(ev, device) {
                let payload = {status: Number(ev), token: device.token}
                this.changeDeviceStatus(payload).then(() => {
                    this.$emit('input', ev)
                })
            },
            formatSensorData(device){
              let sensorData = device.sensorsData[0]
              console.log(device)
              if (sensorData){
                return {
                  temperature: sensorData.temperature || 'N/A',
                  humidity: sensorData.humidity || 'N/A',
                  date: sensorData.date || 'N/A'
                }
              }

              return {
                temperature: 'N/A',
                humidity: 'N/A'
              }
            },
            generateQr(key, token) {
                let canvasEl = this.$refs[`qr-${key}`].shift()
                qrcode.toCanvas(canvasEl, token, (error) => {
                     if (error) console.error(error)
    // console.log('success!');
                })
            }
        }
    };
</script>
