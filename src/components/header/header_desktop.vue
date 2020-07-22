<template>
    <v-app-bar
            v-bind="vAppBarDesktop"
            style="border-radius: 0px !important;"
    >
        <template v-slot:img="{ props }">
            <!--      <v-img-->
            <!--              v-bind="props"-->
            <!--              gradient="to top right, rgba(54, 57, 63,.7), rgba(54, 57, 63,.7)"-->
            <!--      ></v-img>-->
        </template>

        <img
                :height="$vuetify.breakpoint.smAndDown ? 32 : 40"
                class="ml-2 clickable"
                src="../../assets/logo.png"
        />
        <v-toolbar-title>Vue.js</v-toolbar-title>
        <div class="flex-grow-1"></div>

        <account_information></account_information>

        <template v-slot:extension v-if="currentTab.length > 0 && window.width > 1265">
<!--            <v-layout>-->
<!--                <v-tabs-->
<!--                        color="action"-->
<!--                        grow-->
<!--                        class="hidden-sm-and-down"-->
<!--                        background-color="transparent"-->
<!--                >-->
<!--                    <v-tab-->
<!--                            v-for="tab in tabs"-->
<!--                            append-->
<!--                            :key="tab.title"-->
<!--                            :to="tab.route"-->
<!--                    ><v-icon style="padding-right: 10px;">{{ tab.icon }}</v-icon>{{ tab.title }}</v-tab>-->
<!--                </v-tabs>-->
<!--            </v-layout>-->
            <v-tabs
                    color="action"
                    class="hidden-sm-and-down"
                    background-color="transparent"
                    align-with-title
            >
                <v-tab
                        v-for="children in currentTab"
                        :key="children.title"
                        :to="{name: children.name}"
                        exact
                ><v-icon style="padding-right: 10px;">{{ children.icon }}</v-icon>{{  children.title }}</v-tab>
            </v-tabs>
        </template>
    </v-app-bar>
</template>

<script>
    import windowSize from '../../mixins/windowSize'
    import account_information from './account_information'
    import Vue from "vue";
    export default {
        name: "Header_desktop",
        props: {},
        components: {
            account_information
        },
        mixins: [windowSize],
        data() {
            return {}
        },
        computed: {
            vAppBarDesktop: vm => ({
                color: 'background',
                app: true,
                fixed: false,
                border: 0,
                outlined: true,
                flat: true,
                height: 49
            }),
            tabs: vm => vm.$store.getters['header/tabs'],
            currentTab() {
                let currentPath = this.$route.matched[0].path;
                let children = [];

                this.tabs.forEach((value) => {
                    if (value.route === currentPath) {
                        children = value.children;
                    }
                })

                return children;
            },
        },
        methods: {
            itIsCurrentRoute(route) {
                let routeName = this.$route.name;

                return route === routeName;
            },
        },
    }
</script>

<style scoped>
    @media (max-width: 960px) {
        .icon-profile {
            left: 35px !important;
        }
    }
    .icon-profile{
        position: absolute;
        top: 0;
        left: 0;
        padding: 0px !important;
        cursor: pointer;
    }
</style>

<style>
    .v-toolbar__extension{
        padding: 0 !important;
    }
</style>
