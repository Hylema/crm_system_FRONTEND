<template>
  <v-menu
      transition="slide-y-transition"
      v-model="menu"
      absolute
      close-on-click
      v-if="currentAuthUser != null || currentAuthUser !== undefined || currentAuthUser !== ''"
  >
    <template v-slot:activator="{ on: menu, attrs }">
      <v-tooltip bottom open-delay="500">
        <template v-slot:activator="{ on: tooltip }">
          <v-list-item class="px-1" v-on="{ ...tooltip, ...menu }" dark>
            <user-avatar :user="currentAuthUser"></user-avatar>
            <v-list-item-title> {{`${currentAuthUser.firstName} ${currentAuthUser.lastName}`}}</v-list-item-title>
          </v-list-item>
        </template>
        <span>Ваш аккаунт</span>
      </v-tooltip>
    </template>
    <v-file-input hide-input style="margin: 0 !important; padding: 0 !important; display: none" @change="changeAvatar" id="fileInput"></v-file-input>
    <v-card width="300" class="background">
      <v-list>
        <v-list-item @click="fileEvent()">
          <v-list-item-action>
            <v-icon>mdi-account-circle</v-icon>
          </v-list-item-action>
          <v-list-item-subtitle>Изменить аватарку</v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <v-list>
        <v-list-item @click="parseJwt()">
          <v-list-item-action>
            <v-icon>mdi-briefcase</v-icon>
          </v-list-item-action>
          <v-list-item-subtitle>Токен в консоли</v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <v-list color="error">
        <v-list-item @click.stop="logout()" dark>
          <v-list-item-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-item-action>
          <v-list-item-subtitle>Выйти</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: "accountInformation",
  data(){
    return {
      menu: false
    }
  },
  methods: {
    logout () {
      this.$store.commit('auth/logout')
      this.$router.push({
        name: 'Auth'
      })
    },
    parseJwt () {
      let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTk1MjQ2NTMzLCJqdGkiOiJhYjYwNzQ1OTlhYzk0ZWJlOWM0ZGJhNWZlYWUxMmIzMSIsInVzZXJfaWQiOjF9.ESLoqUOw4vTT6q-xpyDxdMctiaycaHSBLySTpnRp6Ec';
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      console.log(JSON.parse(jsonPayload), 'JSON.parse(jsonPayload)')

      return JSON.parse(jsonPayload);
    },
    changeAvatar(file){
      this.$store.dispatch('user/changeAvatar', file)
    },
    fileEvent(){
      document.getElementById("fileInput").click()
    }
  },
  computed: {
    currentAuthUser: vm => vm.$store.getters["user/currentUser"]
  }
}
</script>

<style scoped>

</style>