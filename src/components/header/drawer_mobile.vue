<!--<template>-->
<!--  <v-navigation-drawer-->
<!--          temporary-->
<!--          fixed-->
<!--          v-model="drawer"-->
<!--  >-->
<!--    <v-list-item>-->
<!--      <v-list-item-avatar>-->
<!--        <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>-->
<!--      </v-list-item-avatar>-->

<!--      <v-list-item-content>-->
<!--        <v-list-item-title>Константинопольский А. В. <br> <span style="opacity: 0.6; font-size: 13px;">Слесарь механосборочных работ</span></v-list-item-title>-->
<!--      </v-list-item-content>-->
<!--    </v-list-item>-->

<!--    <v-divider></v-divider>-->

<!--    <v-list dense v-model="currentPageTitle">-->

<!--      <v-list-item-->
<!--              v-model="currentPageTitle"-->
<!--              v-for="tab in tabs"-->
<!--              :key="tab.title"-->
<!--              value="true"-->
<!--              :to="tab.route"-->
<!--              link-->
<!--      >-->
<!--        <v-list-item-icon>-->
<!--          <v-icon>{{ tab.icon }}</v-icon>-->
<!--        </v-list-item-icon>-->

<!--        <v-list-item-content v-model="currentPageTitle">-->
<!--          <v-list-item-title v-model="currentPageTitle">{{ tab.title }}</v-list-item-title>-->
<!--        </v-list-item-content>-->
<!--      </v-list-item>-->
<!--    </v-list>-->
<!--  </v-navigation-drawer>-->
<!--</template>-->

<!--<script>-->

<!--  export default {-->
<!--    name: "Header_mobile",-->
<!--    props: {-->
<!--      tabs: Array,-->
<!--    },-->
<!--    data: () => {-->
<!--      return {}-->
<!--    },-->
<!--    computed: {-->
<!--      // drawer: {-->
<!--      //   get: vm => vm.$store.getters['header/drawer'],-->
<!--      //   set (value) {}-->
<!--      // },-->
<!--      currentPageTitle: {-->
<!--        get: vm => vm.$store.getters['header/currentPageTitle'],-->
<!--        set (value) {-->
<!--          console.log(value)-->
<!--          this.$store.commit('header/currentPageTitle', value)-->
<!--        }-->
<!--      },-->
<!--    },-->
<!--    watch: {}-->
<!--  }-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->
