<template>
    <v-navigation-drawer
            v-model="drawer"
            class="background"
            app
            :mini-variant="mini_variant"
    >
        <v-list style="padding: 0" >
            <v-list-item
                    color="action"
                    @click.stop="themeIsDark = !themeIsDark"
            >
                <v-list-item-action>
                    <v-icon>{{ 'mdi-weather-sunny'}}</v-icon>
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
                    <v-icon>{{ 'mdi-weather-night'}}</v-icon>
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

        <v-list style="padding: 0" v-else>
            <v-list-item link :to="tab.route" color="action" v-for="tab in tabs" v-if="tab.name !== 'Admin' || currentUserIsAdmin">
                <v-list-item-action>
                    <v-icon>{{ tab.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>{{ tab.title }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>




        <v-list style="padding: 0; position: absolute; bottom: 0; width: 100%" v-if="window.width > 1262">
            <v-list-item @click="mini_variant = !mini_variant">
                <v-list-item-action>
                    <v-icon>{{ !mini_variant ? 'mdi-arrow-collapse-horizontal' : 'mdi-arrow-expand-horizontal' }}</v-icon>
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
    </v-navigation-drawer>
</template>

<script>
    import windowSize from '../../mixins/windowSize'
    import account_information from "@/components/header/account_information";
    export default {
      name: "app_drawer",
      mixins: [windowSize],
      components: {
        account_information
      },
        data(){
          return {
              mini_variant: false,
          }
        },
        computed: {
          currentUserIsAdmin: vm => vm.$store.getters["auth/currentUserIsAdmin"],
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
            }
        },
        methods: {

        }
    }
</script>

<style scoped>

</style>