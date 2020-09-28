<template>
  <v-progress-linear
      color="white"
      style="bottom: 0"
      indeterminate
      v-bind="vProgressLinear"
      :active="loading"
  ></v-progress-linear>
</template>

<script>
export default {
  name: "loading",
  props: {
    loading: Boolean
  },
  data() {
    return {
      load: 0,
      bufferValue: 2,
      interval: 0,
      active: false
    }
  },
  beforeDestroy () {
    clearInterval(this.interval)
  },
  watch: {
    loading(newValue, oldValue){
      console.log(newValue, 'newValue')
      if(newValue){
        this.active = true
        this.load = 1
      } else {
        this.load = 100
        this.active = false
      }
    },
    // load (val) {
    //   if (val < 100) return
    //
    //
    //   console.log(val, 'val')
    //
    //   this.load = 0
    //   this.startBuffer()
    // },
  },
  computed: {
    vProgressLinear: vm => ({
      absolute: true,
      rounded: true,
      // color: theme.actions,
      height: 3,
    }),
  },
  methods: {
    startBuffer () {
      clearInterval(this.interval)

      this.interval = setInterval(() => {
        this.load += Math.floor(Math.random() * Math.floor(5));
      }, 200)
    },
  }
}
</script>

<style scoped>

</style>