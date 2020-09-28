<template>
  <v-navigation-drawer
      v-model="drawer"
      class="background"
      app
      :mini-variant="drawerThemeIsMini"
      :src="themeIsDark ? require('@/assets/images/darkBackgroundImage.jpg') : require('@/assets/images/lightBackgroundImage.jpg')"
      permanent
      overlay-color="red"
  >
    <template v-slot:img="{ height, src }">
      <v-img
          :src="src"
          :height="height"
          gradient="to top right, rgba(100,115,201,.13), rgba(25,32,72,.8)"
      ></v-img>
    </template>
    <v-list style="padding: 0" >
      <v-list-item
          @click.stop="themeIsDark = !themeIsDark"
      >
        <v-list-item-action>
          <v-icon dark>{{ 'mdi-weather-sunny'}}</v-icon>
        </v-list-item-action>

        <v-switch
            style="width: 100%; margin: 0 auto; position: relative;top: 30%; left: 15%;"
            dense
            :hide-details="true"
            v-model="themeIsDark"
            color="action"
            flat
            inset
            disabled
        ></v-switch>

        <v-list-item-action>
          <v-icon dark>{{ 'mdi-weather-night'}}</v-icon>
        </v-list-item-action>
      </v-list-item>
    </v-list>



    <account_information></account_information>


    <v-list style="padding: 0" v-if="window.width < 1262">
      <v-list-item link :to="tab.route" color="action" v-for="tab in tabs" v-if="!tab.children">
        <v-list-item-action>
          <v-icon>{{ tab.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ tab.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-group
          v-else
          no-action
          :prepend-icon="tab.icon"
      >
        <template v-slot:activator>
          <v-list-item-title>{{ tab.title }}</v-list-item-title>
        </template>

        <v-list-item
            v-for="(item, index) in tab.children"
            color="action"
            :to="{name: item.name}"
            exact
            link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list>

    <v-list style="padding: 0" v-else dark>
      <v-list-item link :to="tab.route" v-for="tab in tabs" v-if="tab.name !== 'Admin' || currentUserIsAdmin">
        <v-list-item-action>
          <v-icon>{{ tab.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ tab.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>


    <template v-slot:append>
      <v-list v-if="window.width > 1262" dark>
        <v-list-item @click="drawerThemeIsMini =! drawerThemeIsMini">
          <v-list-item-action>
            <v-icon>{{ !drawerThemeIsMini ? 'mdi-arrow-collapse-horizontal' : 'mdi-arrow-expand-horizontal' }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Свернуть</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-list style="padding: 0; position: absolute; bottom: 0; width: 100%" v-else>
        <v-list-item @click="drawer = false">
          <v-list-item-action>
            <v-icon>mdi-close</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Закрыть</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script>
import windowSize from '../../mixins/windowSize'
import account_information from "@/components/menu/accountInformation";
export default {
  name: "app_drawer",
  mixins: [windowSize],
  components: {
    account_information
  },
  data(){
    return {}
  },
  computed: {
    currentUserIsAdmin: vm => vm.$store.getters["user/currentUserIsAdmin"],
    drawer: {
      get(){
        return this.$store.getters['header/drawer'];
      },
      set (value) {
        this.$store.commit('header/drawer', value)
      }
    },
    tabs: vm => vm.$store.getters['header/tabs'],
    themeIsDark: {
      get(){
        let isDark = this.$store.getters['theme/themeIsDark'];

        this.$vuetify.theme.dark = isDark;
        return isDark;
      },
      set (value) {
        this.$vuetify.theme.dark = value;
        this.$store.dispatch('theme/setTheme', value);
      }
    },
    drawerThemeIsMini: {
      get(){
        return this.$store.getters['theme/drawerThemeIsMini'];
      },
      set (value) {
        this.$store.dispatch('theme/setDrawerTheme', value);
      }
    }
  },
  methods: {

  }
}
</script>

<style scoped>

</style>