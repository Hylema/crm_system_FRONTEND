<template>
  <v-menu
      transition="slide-y-transition"
      v-model="menu"
      absolute
      close-on-click
      v-if="currentAuthUser != null"
  >
    <template v-slot:activator="{ on: menu, attrs }">
      <v-tooltip bottom open-delay="500">
        <template v-slot:activator="{ on: tooltip }">
          <v-list-item class="px-2" v-on="{ ...tooltip, ...menu }">
            <v-list-item-avatar>
              <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
            </v-list-item-avatar>

            <v-list-item-title>{{`${currentAuthUser.firstName} ${currentAuthUser.lastName}`}}</v-list-item-title>
          </v-list-item>
        </template>
        <span>Ваш аккаунт</span>
      </v-tooltip>
    </template>
    <v-card width="300" class="background">
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-img src="https://cdn.vuetifyjs.com/images/john.png"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{`${currentAuthUser.firstName} ${currentAuthUser.lastName}`}}</v-list-item-title>
            <v-list-item-subtitle>{{ currentAuthUser.email }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn
                icon
                @click="menu = false"
            >
              <v-icon>mdi-close-circle</v-icon>
            </v-btn>
          </v-list-item-action>
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
  name: "account_information",
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
  },
  computed: {
    currentAuthUser: vm => vm.$store.getters["auth/getCurrentUser"]
  }
}
</script>

<style scoped>

</style>