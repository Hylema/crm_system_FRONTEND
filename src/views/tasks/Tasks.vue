<template>
  <div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>

    <task_dialog></task_dialog>
  </div>
</template>

<script>
import store from "../../store";
import task_dialog from '../../components/dialogs/task_dialog'
export default {
  name: "Tasks",
  components: {task_dialog},
  beforeRouteEnter (to, from, next) {
    next()
  },
  beforeRouteUpdate (to, from, next) {
    // if(
    //     this.savedRoutesNames[RouteNames.TASKS] !== RouteNames.TASKS &&
    //     this.savedRoutesNames[RouteNames.TASKS] !== this.$route.name
    // ){
    //     store.commit('header/saveRoute', {
    //         route: RouteNames.TASKS,
    //         name: to.name,
    //     })
    // }

    next()
  },
  beforeRouteLeave (to, from, next) {
    next()
  },
  data() {
    return {}
  },
  mounted() {
    // this.$router.beforeEach((to, from, next) => {
    //     console.log(from, 'from');
    //     console.log(to, 'to');
    //     next()
    // })
  },
  computed: {
    vAppBarDesktop: vm => ({
      fixed: true,
      color: 'background',
      app: true,
      border: 0,
    }),
    savedRoutesNames: vm => vm.$store.getters['header/savedRoutesNames'],
    // goTo(){
    //     if(this.$route.name !== 'Tasks'){
    //         let lastRoute = null;
    //
    //         this.savedRoutes.forEach((value) => {
    //             if(value.name === 'Tasks'){
    //                 lastRoute = value.lastRoute;
    //             }
    //         })
    //
    //         // console.log(this.$route.name, 'this.$router.name');
    //         // console.log(lastRoute, 'lastRoute');
    //
    //         if(lastRoute !== null && this.$route.name !== lastRoute){
    //             console.log('PUSH');
    //
    //             this.$router.push({
    //                 name: lastRoute
    //             });
    //         }
    //
    //         return true;
    //     }
    // },
    // savedRoutes: vm => vm.$store.getters['header/savedRoutes'],
    // currentTab() {
    //     let currentPath = this.$route.matched[0].path;
    //     console.log(this.$route.matched[0].path);
    //     let children = [];
    //
    //     this.tabs.forEach((value) => {
    //         if (value.route === currentPath) {
    //             children = value.children;
    //         }
    //     })
    //
    //     return children;
    // },
  },
  methods: {
    itIsCurrentRoute(route) {
      let routeName = this.$route.name
      console.log(route, routeName)
      return route === routeName
    },
    selectRoute(route){
      this.$store.commit('header/saveRoute', {
        name: route,
      })
    },
  },
}
</script>

<style scoped>

</style>