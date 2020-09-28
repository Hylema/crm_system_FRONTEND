<template>
  <v-card class="overflow-hidden">
    <appHeaderDesktop
            class="hidden-md-and-down"
    ></appHeaderDesktop>
    <appHeaderMobile
            class="hidden-lg-and-up"
    ></appHeaderMobile>
  </v-card>
</template>

<script>
  import appHeaderDesktop from './appHeaderDesktop'
  import appHeaderMobile from './appHeaderMobile'

  export default {
    name: "Header",
    components: {
      appHeaderDesktop,
      appHeaderMobile
    },
    methods: {},
    computed: {}
  }
</script>

<style scoped>

</style>
