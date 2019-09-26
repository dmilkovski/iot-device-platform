<script>
import { Line } from 'vue-chartjs'

export default {
  name: 'DeviceChart',
  props: ['options', 'data'],
  extends: Line,
  mounted () {
    this.renderChart(this.data, this.options)
  },
  methods: {
    update(){
      this.$data._chart.update()
    }
  }
}
</script>
