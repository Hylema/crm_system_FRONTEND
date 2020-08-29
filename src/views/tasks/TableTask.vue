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
      class="elevation-1"
      :loading="loadingTasks"
      loading-text="Идет загрузка..."
      @click:row="tableRow"
  >
    <template v-slot:item.status="{ item }">
      <v-chip>{{ item.status.name }}</v-chip>
    </template>
    <template v-slot:item.author="{ item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-avatar
              color="action"
              size="30"
              v-bind="attrs"
              v-on="on"
          >
            <v-icon dark>mdi-account-circle</v-icon>
          </v-avatar>
        </template>
        <strong>{{ `  ${item.author.lastName} ${item.author.firstName}` }}</strong>
      </v-tooltip>
    </template>
    <template v-slot:item.responsible="{ item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-avatar
              color="action"
              size="30"
              v-bind="attrs"
              v-on="on"
          >
            <v-icon dark>mdi-account-circle</v-icon>
          </v-avatar>
        </template>
        <strong>{{ `${item.responsible.lastName} ${item.responsible.firstName}` }}</strong>
      </v-tooltip>
    </template>
    <template v-slot:item.observers="{ item }">
      <v-tooltip bottom v-for="observer in item.observers">
        <template v-slot:activator="{ on, attrs }">
          <v-avatar
              color="action"
              size="30"
              v-bind="attrs"
              v-on="on"
          >
            <v-icon dark>mdi-account-circle</v-icon>
          </v-avatar>
        </template>
        <strong>{{ `${observer.lastName} ${observer.firstName}` }}</strong>
      </v-tooltip>
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
      <v-toolbar flat color="background">
        <v-btn
            color="action"
            dark
            class="mr-2"
            @click="filter()"
        >Все</v-btn>
        <v-btn
            color="action"
            dark
            class="mr-2"
            @click="filter({ author: true })"
        >Автор</v-btn>
        <v-btn
            color="action"
            dark
            class="mr-2"
            @click="filter({ responsible: true })"
        >Ответственный</v-btn>
        <v-btn
            color="action"
            dark
            class="mr-2"
            @click="filter({ observers: true })"
        >Наблюдатель</v-btn>
        <v-btn
            color="action"
            dark
            class="mr-2"
            @click="filter({ deleted: true })"
        >Удаленные</v-btn>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="900px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                color="action"
                dark
                v-bind="attrs"
                v-on="on"
                @click="preCreateTask()"
            >Создать задачу</v-btn>
          </template>
          <v-card class="background">
            <v-progress-linear
                color="action"
                v-bind="vProgressLinear"
                :active="loadingActionTask"
                :indeterminate="loadingActionTask"
            ></v-progress-linear>
            <v-layout justify-space-between>
              <v-card-title class="headline">{{ formTitle }}</v-card-title>
              <v-card-title><v-btn class="mx-2" fab dark small color="action" @click="dialog = false"><v-icon>close</v-icon></v-btn></v-card-title>
            </v-layout>

            <v-divider style="margin: 0px"></v-divider>

            <v-card-text>
              <v-container>
                <v-form v-model="valid" ref="form">
                  <v-layout justify-space-between>
                    <v-flex md6 style="margin-right: 10px">
                      <v-text-field :rules="titleRules" clearable outlined :autofocus="currentAction === 'create'" v-model="editedTask.title" label="Название задачи" color="action"></v-text-field>
                      <v-textarea :rules="descriptionRules" outlined v-model="editedTask.description" label="Описание задачи" color="action" height="228">
                        <template v-slot:append>
                          <v-icon>mdi-paperclip</v-icon>
                          <v-icon>mdi-emoticon-happy-outline</v-icon>
                        </template>
                      </v-textarea>
                    </v-flex>
                    <v-flex md6>
                      <v-menu
                          ref="menu"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                          v-model="menuDatePicker"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                              color="action"
                              :rules="dateRules"
                              outlined
                              v-model="editedTask.dueDate.date"
                              label="Дата завершения задачи"
                              prepend-inner-icon="event"
                              :hide-details="false"
                              readonly
                              clearable
                              v-bind="attrs"
                              v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="datePicker" scrollable>
                          <v-spacer></v-spacer>
                          <v-btn text dark class="action" @click="saveDate()">OK</v-btn>
                          <v-btn text dark class="action" @click="menuDatePicker = false">Назад</v-btn>
                        </v-date-picker>
                      </v-menu>

                      <v-menu
                          ref="menu"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          v-model="menuTimePicker"
                          max-width="290px"
                          min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                              color="action"
                              :rules="timeRules"
                              outlined
                              v-model="editedTask.dueDate.time"
                              label="Время завершения задачи"
                              prepend-inner-icon="access_time"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                          ></v-text-field>
                        </template>
                        <v-time-picker
                            v-model="timePicker"
                            full-width
                        >
                          <v-spacer></v-spacer>
                          <v-btn text dark class="action" @click="saveTime()">OK</v-btn>
                          <v-btn text dark class="action" @click="menuTimePicker = false">Назад</v-btn>
                        </v-time-picker>
                      </v-menu>

                      <v-combobox
                          :rules="responsibleRules"
                          v-model="editedTask.responsible"
                          :items="allUsers"
                          :item-text="'firstName'"
                          :item-value="allUsers.id"
                          label="Выбрать ответственного"
                          clearable
                          no-data-text="Нет пользователей"
                          outlined
                          color="action"
                      >
                        <template v-slot:selection="data">
                          <v-chip
                              :key="JSON.stringify(data.item)"
                              v-bind="data.attrs"
                              :input-value="data.selected"
                              :disabled="data.disabled"
                              @click:close="data.parent.selectItem(data.item)"
                          >
                            <v-avatar
                                class="accent white--text"
                                left
                                v-text="data.item.firstName.slice(0, 1).toUpperCase()"
                            ></v-avatar>
                            {{ data.item.firstName }}
                          </v-chip>
                        </template>
                      </v-combobox>

                      <v-combobox
                          :rules="observerRules"
                          color="action"
                          v-model="editedTask.observers"
                          hide-selected
                          :items="allUsers"
                          :item-text="'firstName'"
                          label="Выбрать наблюдателей"
                          multiple
                          clearable
                          outlined
                          no-data-text="Нет пользователей"
                      >
                        <template v-slot:selection="data">
                          <v-chip
                              :key="JSON.stringify(data.item.firstName)"
                              v-bind="data.attrs"
                              :input-value="data.selected"
                              :disabled="data.disabled"
                              @click:close="data.parent.selectItem(data.item.firstName)"
                          >
                            <v-avatar
                                class="accent white--text"
                                left
                                v-text="data.item.firstName.slice(0, 1).toUpperCase()"
                            ></v-avatar>
                            {{ data.item.firstName }}
                          </v-chip>
                        </template>
                      </v-combobox>

                      <v-combobox
                          v-if="currentAction === 'edit'"
                          :rules="taskStatusRules"
                          v-model="editedTask.status"
                          :item-text="'name'"
                          color="action"
                          outlined
                          :items="allTaskStatus"
                          label="Статус"
                      ></v-combobox>
                    </v-flex>
                  </v-layout>
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="action" :disabled="!valid" dark text @click="actionTask()">{{ actionTitle }}</v-btn>
              <v-btn class="action" dark text @click="dialog = false">Назад</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
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
import dateformat from 'dateformat'
import store from "@/store";
export default {
  name: "TableTask",
  data: () => ({
    titleRules: [
      v => !!v || 'Это поле обязательно для заполнения',
    ],
    descriptionRules: [
      v => !!v || 'Это поле обязательно для заполнения',
    ],
    dateRules: [
      v => !!v || 'Это поле обязательно для заполнения',
    ],
    timeRules: [
      v => !!v || 'Это поле обязательно для заполнения',
    ],
    responsibleRules: [
      v => !!v || 'Это поле обязательно для заполнения',
    ],
    observerRules: [],
    taskStatusRules: [
      v => !!v || 'Это поле обязательно для заполнения',
    ],
    dialog: false,
    valid: false,
    menuDatePicker: false,
    menuTimePicker: false,
    datePicker: null,
    timePicker: null,
    currentAction: null,
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
    dateFormat: "yyyy-mm-dd",
    timeFormat: "HH:MM:ss",
    createTaskModel: {
      title: '',
      description: '',
      dueDate: null,
      responsible: null,
      observers: []
    },
    editTaskModel: {
      id: null,
      title: '',
      description: '',
      dueDate: null,
      responsible: null,
      observers: [],
      status: null
    },
    editedTask: {
      id: null,
      title: '',
      description: '',
      dueDate: {
        date: '',
        time: ''
      },
      responsible: null,
      observers: null,
      status: null
    },
    formTitle: '',
    actionTitle: '',
  }),
  computed: {
    vProgressLinear: vm => ({
      absolute: true,
      top: true,
      height: 7
    }),
    task_dialog: {
      get(){
        return this.$store.getters["tasks/task_dialog"];
      },
      set (value) {
        this.$store.commit('tasks/dialogState', value)
      }
    },
    tasks: vm => vm.$store.getters["tasks/tasks"],
    allUsers: vm => vm.$store.getters["admin/users"],
    allTaskStatus: vm => vm.$store.getters["tasks/allTaskStatus"],

    loadingTasks: vm => vm.$store.getters["tasks/loadingTasks"],
    loadingActionTask: vm => vm.$store.getters["tasks/loadingActionTask"],
  },

  methods: {
    filter(date){
      store.commit("tasks/loadingTasks", true)

      if(date != null){
        this.$stomp.send("/app/getAllTask", {}, JSON.stringify(date))
      } else {
        this.$stomp.send("/app/getAllTask")
      }
    },
    // handleInputResponsible(data) {
    //   if(data !== undefined){
    //     this.task.responsible = data.id;
    //   }
    // },
    // handleInputObserves(data) {
    //   if(data !== undefined){
    //     let list = [];
    //     data.forEach((value) => list.push(value.id))
    //     this.task.observers = list;
    //   }
    // },
    saveDate(){
      let date = new Date(this.datePicker)
      this.editedTask.dueDate.date = dateformat(date, this.dateFormat)

      this.menuDatePicker = false;
      // this.$refs.menu.save(this.editedTask.dueDate.date)
    },
    saveTime(){
      console.log(this.timePicker)
      this.editedTask.dueDate.time = this.timePicker

      // let date = new Date(this.timePicker)
      // this.editedTask.dueDate.time = dateformat(date, this.timeFormat)

      this.menuTimePicker = false;
    },
    preCreateTask(){
      const action = 'create';
      this.checkCurrentAction(action);

      this.formTitle = 'Создание задачи'
      this.actionTitle = 'Создать'

      this.dialog = true
      console.log(this.$refs.form)
    },
    preEditTask (task) {
      const action = 'edit';
      this.checkCurrentAction(action);

      this.formTitle = "Редактирование задачи"
      this.actionTitle = 'Изменить'

      this.editedTask.id = task.id;
      this.editedTask.title = task.title;
      this.editedTask.description = task.description;
      this.editedTask.responsible = task.responsible;
      this.editedTask.observers = task.observers;
      this.editedTask.status = task.status;

      console.log(task.dueDate, 'task.dueDate')

      let date = new Date(task.dueDate)

      this.editedTask.dueDate.date = `${dateformat(date, this.dateFormat)}`
      this.editedTask.dueDate.time = `${dateformat(date, this.timeFormat)}`

      this.dialog = true
    },
    deleteTask (task) {
      confirm('Are you sure you want to delete this task?') && this.$stomp.send("/app/deleteTask", {}, JSON.stringify({
        id: task.id
      }))
    },
    actionTask(){
      if(this.currentAction === 'edit') this.updateTask();
      else this.createTask();

    },
    createTask () {
      store.commit("tasks/loadingActionTask", true)

      const task = this.prepareTask(this.createTaskModel)

      console.log("createTask", task)
      this.$stomp.send("/app/createTask", {}, JSON.stringify(task))
    },
    updateTask(){
      store.commit("tasks/loadingActionTask", true)
      const task = this.prepareTask(this.editTaskModel)

      console.log("updateTask", task)
      this.$stomp.send("/app/updateTask", {}, JSON.stringify(task))
    },
    tableRow(task){
      store.commit("tasks/loadingDetails", true)

      this.task_dialog = true

      this.$stomp.send("/app/detailsTask", {}, JSON.stringify({
        id: task.id
      }))
    },
    checkCurrentAction(action){
      if(this.currentAction !== action && this.currentAction !== null){
        if(this.$refs.form !== null){
          this.$refs.form.reset()
        }
      }

      this.currentAction = action
    },
    prepareTask(model){
      return Object.assign(...Object.keys(model).map(key => {
        const editedTask = this.editedTask

        switch (key){
          case 'dueDate': {
            const date = new Date(`${editedTask[key].date} ${editedTask[key].time}`)
            console.log('date', date)

            const dateFormat = dateformat(date, this.dateFormat)
            const timeFormat = dateformat(date, this.timeFormat)

            console.log(timeFormat, 'timeFormat')

            return ({ [key]: `${dateFormat}T${timeFormat}Z` })
          }
          case 'responsible': return ({ [key]: editedTask[key].id });
          case 'observers': return ({ [key]: editedTask[key].map(observer => observer.id) });
          case 'status': return ({ [key]: editedTask[key].id });
          default: return ({ [key]: editedTask[key] })
        }
      }));
    },
    getColorDate(date){
      const dueDate = new Date(date)

      let currentDate = new Date()
      currentDate = new Date(Date.UTC(
          currentDate.getUTCFullYear(),
          currentDate.getUTCMonth(),
          currentDate.getDate(),
          currentDate.getUTCHours(),
          currentDate.getUTCMinutes(),
          currentDate.getUTCSeconds())
      )

      if(currentDate > dueDate){
        return 'error'
      } else if(
          currentDate.getUTCFullYear() === dueDate.getUTCFullYear() &&
          currentDate.getUTCMonth() === dueDate.getUTCMonth() &&
          dueDate.getDate() - currentDate.getDate() <= 3
      ){
        return 'warning'
      } else {
        return 'success'
      }
    }
  },
}
</script>

<style scoped>
  tr {
    cursor: pointer !important;
  }
</style>