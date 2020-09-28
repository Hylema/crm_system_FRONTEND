<template>
  <div id="app">
    <v-app id="inspire" v-if="!userIsAuth">
      <header-component></header-component>

      <v-main class="background">
        <!--        <transition name="fade" mode="out-in">-->
        <keep-alive>
          <RouterView />
        </keep-alive>
        <!--        </transition>-->
      </v-main>

      <app_drawer></app_drawer>

      <!--      <footer-component></footer-component>-->

      <apiNotificationComponent></apiNotificationComponent>
      <userNotification></userNotification>
    </v-app>
    <v-app id="inspire" v-if="userIsAuth">
      <v-main>
        <keep-alive>
          <RouterView />
        </keep-alive>
      </v-main>

      <apiNotificationComponent></apiNotificationComponent>
    </v-app>
  </div>
</template>

<script>
import headerComponent from './components/app/appHeader';
import apiNotificationComponent from './components/notification/apiNotification';
import userNotification from './components/notification/forUserNotification';
import app_drawer from './components/app/appDrawer';
import stompConnect from "@/plugins/ws";
import {mapState} from "vuex";
export default {
  name: 'App',
  components: {
    headerComponent,
    apiNotificationComponent,
    userNotification,
    app_drawer
  },
  mounted() {
    if(this.token !== null && this.refresh !== null){
      this.$store.dispatch('auth/tokenVerify').then(tokenVerify => {
        if(!tokenVerify){
          this.$store.dispatch('auth/getTokenByRefresh').then(refreshToken => {
            if(!refreshToken){
              this.$store.commit('auth/logout')
              this.$router.push({
                name: 'Auth'
              })
            } else {
              stompConnect()
            }
          })
        } else {
          stompConnect()
        }
      })
    }
  },
  data() {
    return {
      items: [
        { title: 'Home', icon: 'dashboard' },
        { title: 'About', icon: 'question_answer' },
      ],
    }
  },
  computed: {
    ...mapState({
      token: state => state.auth.token,
      refresh: state => state.auth.refresh,
    }),
    userIsAuth() {
      let routeName = this.$route.name;

      return routeName === 'Auth';
    },
    themeIsDark: {
      get(){
        let isDark = this.$store.getters['theme/themeIsDark'];

        this.$vuetify.theme.dark = isDark;
        return isDark;
      },
    }
  },
  methods: {}
}
</script>

<style>
/*::-webkit-scrollbar {*/
/*    width: 12px;*/
/*}*/
/*::-webkit-scrollbar-track {*/
/*    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);*/
/*    background-color: black;*/
/*}*/
/*::-webkit-scrollbar-thumb {*/
/*    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);*/
/*    background-color: #36393f;*/
/*}*/
</style>

<style>
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active до версии 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

a {
  text-decoration: none !important;
}

input:-webkit-autofill {
  -webkit-text-fill-color: white !important;
  transition: background-color 5000s ease-in-out 0s;
}

button:active {
  outline: none !important;
}
button {
  outline: none !important;
}
</style>


