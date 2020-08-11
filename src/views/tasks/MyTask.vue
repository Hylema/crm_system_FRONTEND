<template>
    <div>
        <div style="overflow-x: auto; display: flex; height: 100%; -webkit-overflow-scrolling: touch;" v-if="window.width > 550">
            <draggable_area
                    v-for="task in tasks"
                    class="ml-2 mt-2 mb-2"
                    :list="task.list"
                    :dragOptions="dragOptions"
                    :title="task.title"
            ></draggable_area>
        </div>
        <div v-else>
            <v-slide-group multiple show-arrows style="padding-top: 10px;">
                <v-slide-item
                        v-for="(task, index) in tasks"
                        :key="task.title"
                        v-slot:default="{ active, toggle }"
                >
                    <v-btn
                            small
                            class="mx-2"
                            active-class="purple white--text"
                            depressed
                            rounded
                            @click="showTask(index)"
                    >
                        {{ task.title }}
                    </v-btn>
                </v-slide-item>
            </v-slide-group>
            <draggable_area
                    class="ml-2 mt-2 mb-2"
                    :list="enterTask.list"
                    :dragOptions="dragOptions"
                    :title="enterTask.title"
            ></draggable_area>
        </div>
    </div>
</template>

<script>
    import draggable_area from "../../components/draggableArea/draggable_tasks";
    import draggable from 'vuedraggable'
    import windowSize from '../../mixins/windowSize'

    const message = [
        "vue.draggable",
        "draggable",
        "component",
        "for",
        "vue.js 2.0",
        "based",
        "on",
        "Sortablejs",
        "vue.draggable",
        "draggable",
        "component",
        "for",
        "vue.js 2.0",
        "based",
        "on",
        "Sortablejs"
    ];

    export default {
        name: "MyTask",
        components: {
            draggable,
            draggable_area,
        },
        mixins: [windowSize],
        mounted() {
          this.enterTask = this.tasks[0]
        },
        data() {
            return {
                tasks: [
                    {
                        title: 'Новая задача',
                        list: message.map((name, index) => {
                            return { name, order: index + 1 };
                        }),
                    },
                    {
                        title: 'Принята к выполнению',
                        list: [],
                    },
                    {
                        title: 'Выполнена',
                        list: [],
                    },
                ],
                enterTask: {},
                drag: false
            };
        },
        methods: {
            sort() {
                this.list = this.list.sort((a, b) => a.order - b.order);
            },
            showTask(index) {
                console.log(index)
                this.enterTask = this.tasks[index]
                console.log(this.enterTask);
            }
        },
        computed: {
            dragOptions() {
                return {
                    animation: 200,
                    group: "description",
                    disabled: false,
                };
            },
        }
    }
</script>

<style>
    /*.v-card-cursor:drag {*/
    /*    cursor: move;*/
    /*}*/
    .list-group-item i {
        cursor: pointer;
    }
</style>