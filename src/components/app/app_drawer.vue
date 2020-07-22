<template>
    <v-navigation-drawer
            v-model="drawer"
            class="background"
            app
            :mini-variant="mini_variant"
    >
        <v-list style="padding: 0" v-if="!mini_variant">
            <v-list-item color="action">
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
                ></v-switch>

                <v-list-item-action>
                    <v-icon>{{ 'mdi-weather-night'}}</v-icon>
                </v-list-item-action>
            </v-list-item>
        </v-list>

        <v-list-item v-else>
            <v-list-item-action>
                <v-icon @click.stop="themeIsDark = !themeIsDark">mdi-brightness-6</v-icon>
            </v-list-item-action>
        </v-list-item>

        <v-list v-for="tab in tabs" style="padding: 0" outlined>
            <v-list-item link :to="tab.route" color="action">
                <v-list-item-action>
                    <v-icon>{{ tab.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>{{ tab.title }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>

        <v-list style="padding: 0; position: absolute; bottom: 0; width: 100%">
            <v-list-item @click="mini_variant = !mini_variant">
                <v-list-item-action>
                    <v-icon>{{ !mini_variant ? 'mdi-arrow-collapse-horizontal' : 'mdi-arrow-expand-horizontal' }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Свернуть</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
    export default {
        name: "app_drawer",
        data(){
          return {
              mini_variant: false,
          }
        },
        computed: {
            drawer: {
                get(){
                    return this.$store.getters['header/drawer'];
                },
                set (value) {
                    // this.$store.commit('header/drawer', {
                    //     value: value
                    // })
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