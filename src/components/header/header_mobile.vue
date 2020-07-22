<template>
    <v-layout>
        <v-app-bar
                v-bind="vAppBarMobile"
                style="border-radius: 0px !important;"
        >

            <v-app-bar-nav-icon>
                <v-icon @click.stop="drawer = true">
                    reorder
                </v-icon>
            </v-app-bar-nav-icon>

            <v-toolbar-title dark>{{ currentPageTitle }}</v-toolbar-title>

            <v-spacer></v-spacer>

            <account_information></account_information>
        </v-app-bar>

<!--        <drawer_mobile :tabs="tabs" ></drawer_mobile>-->
    </v-layout>
</template>

<script>
    import account_information from './account_information'
    export default {
        name: "header_mobile",
        props: {
            tabs: Array,
        },
        components: {
            account_information
        },
        data() {
            return {

            }
        },
        computed: {
            drawer: {
                get: vm => vm.$store.getters['header/drawer'],
                set (value) {
                    this.$store.commit('header/drawer', {
                        value: value
                    })
                }
            },
            currentPageTitle: {
                get: vm => vm.$store.getters['header/currentPageTitle'],
            },
            vAppBarMobile: vm => ({
                fixed: true,
                color: 'background',
                app: true,
                flat: true,
                dense: true,
            }),
        },
        methods: {},
    }
</script>

<style scoped>

</style>