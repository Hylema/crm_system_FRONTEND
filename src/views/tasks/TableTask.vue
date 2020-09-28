<template>
  <v-data-table
      :options="{
  itemsPerPage: 100,
}"
      :items-per-page-options="[30, 50, 100]"
      :headers="headers"
      :items="tasks"
      show-expand
      sort-by="calories"
      class="elevation-1 tableColor"
      :loading="loadingTasks"
      loading-text="Идет загрузка..."
      @click:row="openTask"
      no-data-text="Нет данных"
  >
    <template v-slot:item.status="{ item }">
      <v-chip>{{ item.status.name }}</v-chip>
    </template>
    <template v-slot:item.author="{ item }">
      <user-avatar :user="item.author" :size="40"></user-avatar>
      <strong>{{ `  ${item.author.lastName} ${item.author.firstName}` }}</strong>
    </template>
    <template v-slot:item.responsible="{ item }">
      <user-avatar :user="item.responsible" :size="40"></user-avatar>
      <strong class="ml-1">{{ `${item.responsible.lastName} ${item.responsible.firstName}` }}</strong>
    </template>
    <template v-slot:item.observers="{ item }">
      <user-avatar v-for="observer in item.observers" :user="observer" :size="40"></user-avatar>
    </template>
    <template v-slot:item.created="{ item }">
      {{ item.created | dateFilter | firstSymbolToUpperCase }}
    </template>
    <template v-slot:item.updated="{ item }">
      {{ item.updated | dateFilter | firstSymbolToUpperCase }}
    </template>
    <template v-slot:item.dueDate="{ item }">
      <v-chip :color="getColorDate(item.dueDate)" dark>{{ item.dueDate | dateFilter | firstSymbolToUpperCase }}</v-chip>
    </template>
    <template v-slot:item.status="{ item }">
      {{ item.status.name }}
    </template>
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">{{ item.description }}</td>
    </template>
    <template v-slot:top>
      <task-filter></task-filter>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
          v-if="item.deleteStatus === false"
          small
          class="mr-2"
          @click.stop="preEditTask(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
          v-if="item.deleteStatus === false"
          small
          @click.stop="deleteTask(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
import store from "@/store";
import getColorForTask from "@/mixins/getColorForTask";
import {mapState} from "vuex";
import taskUtil from "@/mixins/utils/task"
export default {
  name: "TableTask",
  mixins: [getColorForTask, taskUtil],
  data: () => ({
    headers: [
      // {
      //   text: 'id',
      //   align: 'center',
      //   sortable: true,
      //   value: 'id',
      // },
      { text: 'Задача', align: 'center', value: 'title' },
      // { text: 'Описание', value: 'description' },
      { text: 'Статус задачи', align: 'center', value: 'status' },
      { text: 'Автор', align: 'center', value: 'author' },
      { text: 'Ответственный', align: 'center', value: 'responsible' },
      { text: 'Наблюдатели', align: 'center', value: 'observers' },
      { text: 'Окончание', align: 'center', value: 'dueDate' },
      { text: 'Дата создание', align: 'center', value: 'created' },
      { text: 'Дата обновления', align: 'center', value: 'updated' },
      { text: 'Описание', align: 'center', value: 'data-table-expand' },
      { text: 'Действия', value: 'actions', sortable: false },
    ],
  }),
  computed: {
    vProgressLinear: vm => ({
      absolute: true,
      top: true,
      height: 7
    }),
    ...mapState({
      dialogDetailsTask: state => state.tasks.dialogDetailsTask,
    }),
    tasks: vm => vm.$store.getters["tasks/tasks"],
    allUsers: vm => vm.$store.getters["users/users"],
    allTaskStatus: vm => vm.$store.getters["tasks/allTaskStatus"],

    loadingTasks: vm => vm.$store.getters["tasks/loadingTasks"],
    loadingActionTask: vm => vm.$store.getters["tasks/loadingActionTask"],
  },

  methods: {},
}
</script>

<style scoped>
  tr {
    cursor: pointer !important;
  }
</style>