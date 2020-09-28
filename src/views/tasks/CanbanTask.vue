<template>
  <div>
    <task-filter></task-filter>

    <div style="overflow-x: auto; display: flex; height: 100%; -webkit-overflow-scrolling: touch;" v-if="window.width > 550">
      <draggable_area
          v-for="status in allTaskStatus"
          class="ml-2 mt-2 mb-2"
          :list="getList(status.id)"
          :dragOptions="dragOptions"
          :status="status"
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
import draggable_area from "../../components/draggableArea/draggableTasks";
import draggable from 'vuedraggable'
import windowSize from '../../mixins/windowSize'

export default {
  name: "canbanTask",
  components: {
    draggable,
    draggable_area,
  },
  mixins: [windowSize],
  mounted() {},
  data() {
    return {
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
    },
    getList(statusId){
      let listTask = []

      this.tasks.forEach(task => {
        if(task.status.id === statusId) return listTask.push(task)
      })

      return listTask
    }
  },
  computed: {
    tasks: vm => vm.$store.getters["tasks/tasks"],
    allTaskStatus: vm => vm.$store.getters["tasks/allTaskStatus"],
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