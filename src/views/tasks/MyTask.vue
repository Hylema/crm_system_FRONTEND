<template>
    <div>
        <div style="overflow-x: auto; display: flex; height: 100%; -webkit-overflow-scrolling: touch;" v-if="window.width > 550">
            <draggable_area
                    class="ml-2 mt-2 mb-2"
                    :list="list"
                    :dragOptions="dragOptions"
                    :title="'Новая задача'"
            ></draggable_area>

            <draggable_area
                    class="ml-2 mt-2 mb-2"
                    :list="[]"
                    :dragOptions="dragOptions"
                    :title="'Принята к выполнению'"
            ></draggable_area>

            <draggable_area
                    class="ml-2 mt-2 mb-2"
                    :list="[]"
                    :dragOptions="dragOptions"
                    :title="'Выполнена'"
            ></draggable_area>
        </div>
        <div v-else>
            <draggable_area
                    class="ml-2 mt-2 mb-2"
                    :list="list"
                    :dragOptions="dragOptions"
                    :title="'Новая задача'"
            ></draggable_area>
        </div>

        <task_dialog></task_dialog>
    </div>
</template>

<script>
    import draggable_area from "../../components/draggableArea/draggable_tasks";
    import draggable from 'vuedraggable'
    import windowSize from '../../mixins/windowSize'
    import task_dialog from '../../components/dialogs/task_dialog'

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
            task_dialog
        },
        mixins: [windowSize],
        data() {
            return {
                list: message.map((name, index) => {
                    return { name, order: index + 1 };
                }),
                drag: false
            };
        },
        methods: {
            sort() {
                this.list = this.list.sort((a, b) => a.order - b.order);
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