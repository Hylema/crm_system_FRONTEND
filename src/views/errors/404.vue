<template>
    <v-container fluid style="height: 100%; padding: 0px">
        <v-layout align-center justify-center column fill-height>
            <div>
                <h1 style="text-align: center">Такой страницы не существует</h1>
            </div>
            <div>
                <strong style="font-size: 150px; ">{{ name }}</strong>
            </div>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "404",
        data()  {
            return {
                name: '404',
            }
        }
    }
</script>

<style scoped>

</style>
