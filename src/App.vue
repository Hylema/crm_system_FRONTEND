<template>
    <div id="app">
        <v-app id="inspire" v-if="!userIsAuth">
            <header-component></header-component>

            <v-main>
                <!--        <transition name="fade" mode="out-in">-->
                <keep-alive>
                    <RouterView />
                </keep-alive>
                <!--        </transition>-->
            </v-main>

            <app_drawer></app_drawer>

            <!--      <footer-component></footer-component>-->

            <notificationComponent></notificationComponent>
        </v-app>
        <v-app id="inspire" v-if="userIsAuth">
            <v-main>
                <keep-alive>
                    <RouterView />
                </keep-alive>
            </v-main>

            <notificationComponent></notificationComponent>
        </v-app>
    </div>
</template>

<script>
    import headerComponent from './components/header/header';
    import notificationComponent from './components/notification/notification';
    import app_drawer from './components/app/app_drawer';
    export default {
        name: 'App',
        components: {
            headerComponent,
            notificationComponent,
            app_drawer
        },
        mounted() {
            // if(!this.userIsAuth){
            //     this.$store.dispatch('auth/tokenVerify').then(res => {
            //         if(!res){
            //             this.$store.dispatch('auth/getTokenByRefresh')
            //         }
            //     })
            //
            // }
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
            userIsAuth() {
                let routeName = this.$route.name;

                return routeName === 'Auth';
            },
            loggedIn: () => this.$store.getters["auth/loggedIn"],
        },
        methods: {}
    }
</script>

<style v-if="themeIsDark">
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


