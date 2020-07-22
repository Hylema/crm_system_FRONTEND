<template>
    <BackToTop style="border: none;">
        <v-btn v-bind="Vbtn" color="background" style="width: 40px; height: 40px;">
            <v-icon color="action">mdi-chevron-up</v-icon>
        </v-btn>
    </BackToTop>
</template>

<script>
    import BackToTop from 'vue-backtotop'
    export default {
        name: "back_button",
        components: {
            BackToTop
        },
        data: () => {
            return {

            }
        },
        computed: {
            Vbtn: vm => ({
                dark: true,
                height: 40,
                width: 40
            }),
        }
    }
</script>

<style scoped>

</style>