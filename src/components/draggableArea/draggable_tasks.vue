<template>
    <v-card class="background overflow-hidden card-width" v-bind:style="window.width < 1485 && 1260 < window.width ? {height: 'calc(100vh - 135px)'} : 1265 > window.width ? 550 > window.width ? {height: '100%'} : {height: 'calc(100vh - 65px)'} : {height: 'calc(100vh - 115px)'}">
<!--        <v-img-->
<!--                class="white&#45;&#45;text align-end"-->
<!--                height="100px"-->
<!--                src="https://www.ejin.ru/wp-content/uploads/2019/05/gora-22.jpg"-->
<!--        ></v-img>-->
        <v-card-title>
            <v-tooltip bottom open-delay="500">
                <template v-slot:activator="{ on }">
                    <v-btn class="mx-2" fab dark small color="action" v-on="on">
                        {{ listLength }}
                    </v-btn>
                </template>
                <span>Кол-во задач в этом разделе</span>
            </v-tooltip>
            {{ titlee }}
        </v-card-title>
        <v-card-text style="overflow-y: auto">
            <draggable
                    :disabled="window.width < 800"
                    ghost-class="ghost"
                    v-bind:style="window.width > 550 ? {height: '85vh'} : {height: '100%'}"
                    class="list-group"
                    v-model="listt"
                    v-bind="dragOptionss"
                    @start="drag = true"
                    @end="drag = false"
            >
                <div
                        v-for="element in listt"
                        :key="element.order"
                        style="padding: 10px 0;"
                >
                    <v-hover
                            v-slot:default="{ hover }"
                            :value="drag"
                    >
                        <v-card
                                :elevation="drag ? 0 : hover ? 12 : 0"
                                hover
                                class="mx-auto v-card-cursor"
                                height="auto"
                                max-width="400"
                                @click="task_dialog = true"
                        >
<!--                            <v-img-->
<!--                                    class="white&#45;&#45;text align-end"-->
<!--                                    height="100px"-->
<!--                                    src="https://www.ejin.ru/wp-content/uploads/2019/05/gora-22.jpg"-->
<!--                            ></v-img>-->
                            <v-card-title>{{ element.name }}</v-card-title>
                            <v-card-subtitle class="pb-0">Whitehaven Beach</v-card-subtitle>

                            <v-card-text class="text--primary">
                                <div>Whitehaven Beach</div>

                                <div>Whitsunday Island, Whitsunday Islands</div>
                            </v-card-text>
                        </v-card>
                    </v-hover>
                    <!--                    <v-card-->
                    <!--                            :class="-->
                    <!--                element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'-->
                    <!--              "-->
                    <!--                            @click="element.fixed = !element.fixed"-->
                    <!--                            aria-hidden="true"-->
                    <!--                    ></v-card>-->
                </div>
            </draggable>
        </v-card-text>
    </v-card>
</template>

<script>
    import windowSize from '../../mixins/windowSize'
    import draggable from 'vuedraggable'
    export default {
        name: "draggable_tasks",
        props: {
            title: String,
            dragOptions: Object,
            list: Array
        },
        components: {
            draggable,
        },
        mixins: [windowSize],
        data() {
            return {
                drag: false,
                titlee: this.title || '',
                dragOptionss: this.dragOptions || {},
                listt: this.list || [],
            }
        },
        computed: {
            listLength: vm => vm.listt.length,
            task_dialog: {
                get(){
                    return this.$store.getters["tasks/task_dialog"];
                },
                set (value) {
                    this.$store.commit('tasks/dialogState', value)
                }
            }
        },
    }
</script>

<style scoped>
    .ghost {
        opacity: 0.4;
    }
    .card-width{
        width: 400px;
        min-width: 400px;
    }
    @media only screen and (max-width: 500px) {
        .card-width{
            width: 97%;
            min-width: 97%;
        }
    }
</style>