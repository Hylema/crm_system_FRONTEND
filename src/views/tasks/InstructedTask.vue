<template>
  <v-data-table
      :options="{
  itemsPerPage: 100,
}"
      :items-per-page-options="[30, 50, 100]"
      :headers="headers"
      :items="allTasks"
      show-expand
      sort-by="calories"
      class="elevation-1"
      :loading="loadingTasks"
      loading-text="Идет загрузка..."
      @click:row="tableRow"
  >
    <template v-slot:item.status="{ item }">
      <v-chip>{{ item.status }}</v-chip>
    </template>
    <template v-slot:item.create_date="{ item }">
      {{ getDate(item.create_date) }}
    </template>
    <template v-slot:item.due_date="{ item }">
      <v-chip color="red" dark>{{ getDate(item.due_date) }}</v-chip>
    </template>
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">{{ item.description }}</td>
    </template>
    <template v-slot:top>
      <v-toolbar flat color="background">
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                color="action"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
            >Создать задачу</v-btn>
          </template>
          <v-card>
            <v-progress-linear
                color="action"
                v-bind="vProgressLinear"
                :active="loadingCreateTask"
                :indeterminate="loadingCreateTask"
            ></v-progress-linear>
            <v-layout justify-space-between>
              <v-card-title class="headline">Создание задачи</v-card-title>
              <v-card-title><v-btn class="mx-2" fab dark small color="action" @click="dialog = false"><v-icon>close</v-icon></v-btn></v-card-title>
            </v-layout>

            <v-divider style="margin: 0px"></v-divider>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field solo v-model="editedTask.name" label="Название задачи"></v-text-field>
                    <v-textarea solo v-model="editedTask.description" label="Описание задачи"></v-textarea>

                    <v-menu
                        ref="menu"
                        :close-on-content-click="false"
                        :return-value.sync="editedTask.dueDate"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            solo
                            v-model="editedTask.dueDate"
                            label="Дата завершения задачи"
                            prepend-inner-icon="event"
                            readonly
                            clearable
                            v-bind="attrs"
                            v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="datePicker" no-title scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="saveDate()">OK</v-btn>
                        <v-btn text color="primary" @click="datePicker = false">Cancel</v-btn>
                      </v-date-picker>
                    </v-menu>

                    <v-combobox
                        v-model="editedTask.responsible"
                        :items="allUsers"
                        :item-text="'first_name'"
                        :item-value="allUsers.id"
                        label="Выбрать ответственного"
                        clearable
                        no-data-text="Нет пользователей"
                        solo
                        @input="handleInputResponsible"
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
                              v-text="data.item.first_name.slice(0, 1).toUpperCase()"
                          ></v-avatar>
                          {{ data.item.first_name }}
                        </v-chip>
                      </template>
                    </v-combobox>

                    <v-combobox
                        v-model="editedTask.observes"
                        hide-selected
                        :items="allUsers"
                        :item-text="'first_name'"
                        label="Выбрать наблюдателей"
                        multiple
                        clearable
                        solo
                        no-data-text="Нет пользователей"
                        @input="handleInputObserves"
                    >
                      <template v-slot:selection="data">
                        <v-chip
                            :key="JSON.stringify(data.item.first_name)"
                            v-bind="data.attrs"
                            :input-value="data.selected"
                            :disabled="data.disabled"
                            @click:close="data.parent.selectItem(data.item.first_name)"
                        >
                          <v-avatar
                              class="accent white--text"
                              left
                              v-text="data.item.first_name.slice(0, 1).toUpperCase()"
                          ></v-avatar>
                          {{ data.item.first_name }}
                        </v-chip>
                      </template>
                    </v-combobox>

                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="save">Создать</v-btn>
              <v-btn color="blue darken-1" text @click="close">Назад</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
          small
          class="mr-2"
          @click.stop="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
          small
          @click.stop="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
import dateformat from 'dateformat'
export default {
  name: "InstructedTask",
  mounted() {
    this.$store.dispatch('tasks/getAllTasks')
    this.$store.dispatch('admin/getAllUsers')
  },
  data: () => ({
    dialog: false,
    datePicker: null,
    monthNames: ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня",
      "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"
    ],
    headers: [
      {
        text: 'id',
        align: 'center',
        sortable: true,
        value: 'id',
      },
      { text: 'Задача', align: 'center', value: 'name' },
      // { text: 'Описание', value: 'description' },
      { text: 'Статус задачи', align: 'center', value: 'status' },
      { text: 'Автор', align: 'center', value: 'author' },
      { text: 'Ответственный', align: 'center', value: 'responsible' },
      { text: 'Наблюдатели', align: 'center', value: 'observer' },
      { text: 'Окончание', align: 'center', value: 'due_date' },
      { text: 'Дата создание', align: 'center', value: 'create_date' },
      { text: 'Описание', align: 'center', value: 'data-table-expand' },
      { text: 'Действия', value: 'actions', sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    dateFormat: "yyyy-mm-dd HH:mm:ss",
    task: {
      name: '',
      description: '',
      dueDate: null,
      responsible: null,
      observes: []
    },
    editedTask: {
      name: '',
      description: '',
      dueDate: null,
      responsible: null,
      observes: null
    },
    defaultItem: {
      name: '',
      description: '',
      dueDate: null,
      responsible: null,
      observes: null
    },
  }),
  computed: {
    vProgressLinear: vm => ({
      absolute: true,
      top: true,
      height: 7
    }),
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    allTasks: vm => vm.$store.getters["tasks/all_tasks"],
    loadingTasks: vm => vm.$store.getters["tasks/loadingTasks"],
    loadingCreateTask: vm => vm.$store.getters["tasks/loadingCreateTask"],
    allUsers: vm => vm.$store.getters["admin/users"],
    task_dialog: {
      get(){
        return this.$store.getters["tasks/task_dialog"];
      },
      set (value) {
        this.$store.commit('tasks/dialogState', value)
      }
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
  },

  methods: {
    handleInputResponsible(data) {
      console.log(data, 'data1')
      this.task.responsible = data.id;
    },
    handleInputObserves(data) {
      console.log(data, 'data2')
      let list = [];
      data.forEach((value) => list.push(value.id))
      this.task.observes = list;
    },
    saveDate(){
      let date = new Date(this.datePicker)

      console.log(dateformat(date, this.dateFormat), 'dateformat(date, this.dateFormat)')

      this.editedTask.dueDate = dateformat(date, this.dateFormat)
      this.task.dueDate = dateformat(date, this.dateFormat)

      this.$refs.menu.save(this.editedTask.dueDate)
    },
    editItem (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item) {
      const index = this.desserts.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    save () {
      // if (this.editedIndex > -1) {
      //   Object.assign(this.desserts[this.editedIndex], this.editedItem)
      // } else {
      //   this.desserts.push(this.editedItem)
      // }
      console.log(this.editedTask, 'editedTask')
      console.log(this.task, 'task')

      let task = this.task;
      let editedTask = this.editedTask;
      this.$store.dispatch('tasks/createTask', {
        name: editedTask.name,
        description: editedTask.description,
        due_date: task.dueDate,
        responsible: task.responsible,
        observer: task.observes,
      }).then(ok => {
        if(ok) this.dialog = false
      });
    },
    getDate(formDate) {
      let date = new Date(formDate);
      return `${date.getDay()}  ${this.monthNames[date.getMonth()]}  ${date.getFullYear()}`;
    },
    tableRow(item){
      this.$store.dispatch('tasks/getTaskDetails', item);
    }
  },
}
</script>

<style scoped>
  tr {
    cursor: pointer !important;
  }
</style>