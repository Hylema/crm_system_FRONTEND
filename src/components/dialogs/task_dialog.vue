<template>
    <v-dialog
            v-model="task_dialog"
            :fullscreen="window.width<=600"
            width="800"
    >
        <v-card color="background">
            <v-layout justify-space-between>
                <v-card-title class="headline">Use Google's location service?</v-card-title>
                <v-card-title><v-btn class="mx-2" fab dark small color="action" @click="task_dialog = false"><v-icon>close</v-icon></v-btn></v-card-title>
            </v-layout>

            <v-layout justify-space-around wrap class="p-2">
                <v-flex sm12 md5>
                    <v-card-text>
                        Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.
                    </v-card-text>

                    <br>

                    <div v-for="comment in comments">

                    </div>

                    <v-card-text>
                        <v-text-field
                                label="Добавить комментарий"
                                outlined
                        ></v-text-field>
                    </v-card-text>
                </v-flex>
                <v-flex sm12 md7>
                    <h4>Статус</h4>
                    <v-overflow-btn
                            class="my-2"
                            :items="dropdown_font"
                            label="Статус"
                    ></v-overflow-btn>

                    <div class="p-2">
                        <h4>Исполнитель</h4>
                        <v-avatar color="action" size="40">
                            <v-icon dark>mdi-account-circle</v-icon>
                        </v-avatar><strong>    Гаджиев И.В.</strong>
                    </div>

                    <div class="p-2">
                        <h4>Автор</h4>
                        <v-avatar color="action" size="40">
                            <v-icon dark>mdi-account-circle</v-icon>
                        </v-avatar><strong>    Горшков Игорь Петя</strong>
                    </div>

                    <v-divider></v-divider>
                    <div class="sc-jrsTQk fVBwUq">
                        <div class="sc-ftesFE vcMHC">
                            <small class="sc-ivQgGC kwlxKn">
                                <span>Создано</span>
                                &nbsp;<span class="sc-fxmata iTzpaR"><span>
                                <span>вчера</span>
                            </span></span>
                            </small>
                        </div>
                        <div class="sc-ftesFE vcMHC">
                            <small class="sc-ivQgGC kwlxKn">
                                <span>Обновлено</span>&nbsp;
                                <span class="sc-fxmata iTzpaR"><span>
                                    <span>15 минут назад</span>
                                </span></span>
                            </small>
                        </div>
                    </div>
                </v-flex>

            </v-layout>
        </v-card>
    </v-dialog>
</template>

<script>
    import windowSize from '../../mixins/windowSize'
    export default {
        name: "task_dialog",
        mixins: [windowSize],
        data(){
            return {
                dropdown_font: ['Новая задача', 'Принята к выполнению', 'Выполнена'],
                comments: []
            }
        },
        computed: {
            task_dialog: {
                get(){
                    console.log('dialog', this.$store.getters["tasks/task_dialog"])
                    return this.$store.getters["tasks/task_dialog"];
                },
                set (value) {
                    console.log(value)
                    this.$store.commit('tasks/dialogState', value)
                }
            }
        }
    }
</script>

<style scoped>

</style>