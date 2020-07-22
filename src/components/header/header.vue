<template>
  <v-card class="overflow-hidden">
    <header_desktop
            class="hidden-md-and-down"
    ></header_desktop>
    <header_mobile
            class="hidden-lg-and-up"
    ></header_mobile>
  </v-card>
</template>

<script>
  import header_desktop from './header_desktop'
  import header_mobile from './header_mobile'

  export default {
    name: "Header",
    components: {
      header_desktop,
      header_mobile
    },
    methods: {},
    computed: {}
  }
</script>

<style scoped>

</style>
