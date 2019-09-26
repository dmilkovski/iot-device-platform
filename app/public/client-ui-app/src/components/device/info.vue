<template>
  <v-container px-0 fluid>
    <v-card>
      <v-card-title class="grey--text" px-0>
        <v-layout row wrap>
          <v-layout column mb-5>
            <v-flex>
            <h2>{{device.label}}</h2>
            </v-flex>
          </v-layout>

          <v-flex>
            <!-- <v-layout column align-end>
              <v-layout row>
                  <v-layout column>
                    <span>Tempereture now:<v-chip color="red lighten-1" text-color="white"> 22 &#8451;</v-chip></span>
                  </v-layout>
                  <v-layout column>
                    <span>Humidity now:
                    <v-chip color="indigo lighten-1" text-color="white">53 %</v-chip></span>
                  </v-layout>
              </v-layout>
            </v-layout> -->
          </v-flex>
        </v-layout>
      </v-card-title>

      <v-container justify-center fluid>
        <v-form ref="dateFilterForm" @submit.prevent="submitDateFilter" v-model="validDateFilter">
          <v-layout row wrap>
            <v-layout column>
              <v-menu
                ref="menuFrom"
                :close-on-content-click="false"
                v-model="menuFrom"
                :nudge-right="40"
                :return-value.sync="dateFrom"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <v-text-field
                  :rules="dateFromRules"
                  slot="activator"
                  v-model="dateFrom"
                  label="From Date"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker v-model="dateFrom" :max="dateNow" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="menuFrom = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="saveDateFrom">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-layout>

            <v-layout column>
              <v-menu
                ref="menuTo"
                :close-on-content-click="false"
                v-model="menuTo"
                :nudge-right="40"
                :return-value.sync="dateTo"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
                :disabled="!dateFrom || menuFrom"
              >
                <v-text-field
                  :rules="dateToRules"
                  :disabled="!dateFrom || menuFrom"
                  slot="activator"
                  v-model="dateTo"
                  label="To Date"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker :disabled="!dateFrom || menuFrom" v-model="dateTo" :min="dateFrom" :max="dateNow" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="menuTo = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.menuTo.save(dateTo)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-layout>

            <v-layout column>
              <v-btn type="submit" color="success">Filter</v-btn>
            </v-layout>

          </v-layout>

        </v-form>
      </v-container>

      <v-container  fluid>
        <device-chart v-if="sensorsDataLength > 0" ref="deviceChart" :data="deviceChartData" :options="deviceChartOptions" />
        <h2 class="mt-5 grey--text" v-else>No data availabel</h2>
        <v-flex column>
          <v-divider />
          <h1 class="mt-5 grey--text">Device History</h1>
          <v-data-table
              :headers="gridHeaders"
              :rows-per-page-items="[-1]"
              :items="history"
              class="elevation-1"
              no-results-text="No history data available for this period"
          >
              <template slot="items" slot-scope="props">

                  <td>{{ props.item.dateTurnOn }}</td>
                  <td>{{ props.item.dateTurnOff }}</td>
                  <td>{{ props.item.userID }}</td>

              </template>
          </v-data-table>
        </v-flex>
      </v-container>

      <v-divider />

      <v-container>

      </v-container>
    </v-card>
  </v-container>
</template>


<script>
import DeviceChart from './chart'
import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'DeviceInfo',
  components: {
    DeviceChart
  },
  props: {
    id: {
        default: ""
    }
  },
  created(){
    this.dateTo = this.dateFrom = this.dateNow
    this.$store.commit('SET_DEVICE_HISTORY', []);
    this.$store.commit('SET_DEVICE', {sensorsData: []});
  },
  watch: {
    device:{
        deep: true,
        immediate: true,
        handler: function (){
          this.deviceChartData.labels = this.device.sensorsData.map(record => record.date)
          this.deviceChartData.datasets[0].data = this.device.sensorsData.map(record => record.temperature) //temp
          this.deviceChartData.datasets[1].data = this.device.sensorsData.map(record => record.humidity)

          if (this.$refs.deviceChart) {
            this.$refs.deviceChart.update()
          }
        }
    }
  },
  methods: {
    ...mapActions(['fetchDeviceById', 'fetchDeviceHistoryById', 'fetchDeviceInfo']),
    saveDateFrom (){
      this.$refs.menuFrom.save(this.dateFrom)
      // this.menuTo = true
    },
    submitDateFilter(){
      if (this.$refs.dateFilterForm.validate()) {
        this.fetchDeviceById({from: this.dateFrom, to: this.dateTo, deviceId: this.id})
        this.fetchDeviceHistoryById({from: this.dateFrom, to: this.dateTo, deviceId: this.id})
      }
    }
  },
  computed: {
      ...mapGetters({
          device: 'getDevice',
          history:  'getHistory'
      }),
      temp (){
          return this.device.sensorsData.map(record => record.temperature)
      },
      dateNow() {
          return new Date().toISOString().split('T')[0]
      },
      sensorsDataLength (){
        return this.device.sensorsData.length
      }
  },
  data(){
    return {

      dateFrom: null,
      menuFrom: false,
      dateTo: null,
      menuTo: false,

      validDateFilter: false,
      dateFromRules: [
        date => !!date || 'Date is required',
        (date) => {
          let dateNow = new Date()
          return dateNow - new Date(date) > 0 || "You can't select dates in future"
        }
      ],
      gridHeaders: [
        { text: "Date turn on", value: "dateTurnOn", sortable: false },
        { text: "Date turn off", value: "dateTurnOff", sortable: false },
        { text: "Username", value: "userID", sortable: false },
      ],
      dateToRules: [
          date => !!date || 'Date is required',
      ],

      deviceChartData: {
        labels: [],
        datasets: [
          {
            label: 'Tempereture',
            backgroundColor: '#f87979',
            borderColor: '#f87979',
            fill: false,
            data: []
          },
          {
            label: 'Humidity',
            backgroundColor: '#5f5fc7',
            borderColor: '#5f5fc7',
            fill: false,
            data: []
          }
        ]
      },
      deviceChartOptions: {
        scales: {
          xAxes: [{
            type: 'time',
            time:{
                stepSize: 1,
                unit: 'hour',
                toolTipFormat: 'YYYY-MM-DD HH:mm',
                displayFormats: {
                    quarter: 'MMM YYYY'
                }
            },
            scaleLabel: {
              display: false,
              labelString: 'Date'
            },
          }],
          yAxes: [{
            scaleLabel: {
              display: false,
              labelString: 'Magnitude'
            },
          }],
        },
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },
}
</script>
