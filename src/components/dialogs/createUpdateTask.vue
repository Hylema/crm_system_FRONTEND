<template>
  <v-dialog
      width="1000"
      v-model="task.active"
  >
    <v-card class="background">
      <v-progress-linear
          color="action"
          v-bind="vProgressLinear"
          :active="loadingCreateUpdateTask"
          :indeterminate="loadingCreateUpdateTask"
      ></v-progress-linear>
      <v-layout justify-space-between>
        <v-card-title class="headline">{{ task.title }}</v-card-title>
        <v-card-title><v-btn class="mx-2" fab dark small color="action" @click="task.active = false"><v-icon>close</v-icon></v-btn></v-card-title>
      </v-layout>

      <v-divider style="margin: 0px"></v-divider>

      <v-card-text>
        <v-container>
          <v-form v-model="valid" ref="form" v-if="task.data">
            <v-layout justify-space-between>
              <v-flex md6 style="margin-right: 10px">
                <v-text-field :rules="titleRules" clearable outlined :autofocus="task.action === 'create'" v-model="task.data.title" label="Название задачи" color="action"></v-text-field>
                <v-textarea :rules="descriptionRules" outlined v-model="task.data.description" label="Описание задачи" color="action" height="228">
                  <template v-slot:append>
                    <v-layout row style="width: 19px; margin-top: -20px">
                      <v-flex md12>
                        <v-file-input hide-input style="margin: 0 !important; padding: 0 !important;" @change="loadFiles" multiple ref="file" v-model="filesInput"></v-file-input>
                      </v-flex>
                      <v-flex class="mt-1">
                        <twemoji v-on:emojiAdded="emojiAdded"></twemoji>
                      </v-flex>
                    </v-layout>
                  </template>
                </v-textarea>
                <task-files :files="task.data.files" v-on:removeFile="removeFile"></task-files>
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
                        v-model="task.data.dueDate.date"
                        label="Дата завершения задачи"
                        prepend-inner-icon="event"
                        :hide-details="false"
                        readonly
                        clearable
                        v-bind="attrs"
                        v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="datePicker" scrollable locale="ru" class="background" color="background">
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
                        v-model="task.data.dueDate.time"
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
                      locale="ru"
                      class="background"
                      color="background"
                  >
                    <v-spacer></v-spacer>
                    <v-btn text dark class="action" @click="saveTime()">OK</v-btn>
                    <v-btn text dark class="action" @click="menuTimePicker = false">Назад</v-btn>
                  </v-time-picker>
                </v-menu>

                <v-combobox
                    :rules="responsibleRules"
                    v-model="task.data.responsible"
                    :items="allUsers"
                    label="Выбрать ответственного"
                    clearable
                    no-data-text="Нет пользователей"
                    outlined
                    color="action"
                >
                  <template v-slot:selection="data">
                    <v-chip
                        class="tableColor"
                        :key="JSON.stringify(data.item)"
                        v-bind="data.attrs"
                        :input-value="data.selected"
                        :disabled="data.disabled"
                        @click:close="data.parent.selectItem(data.item)"
                    >
                      <user-avatar :user="data.item"></user-avatar>
                      {{ data.item.firstName }}
                    </v-chip>
                  </template>
                  <template v-slot:item="{ attrs, on, item }">
                    <v-list-item :key="item.id" dense v-on="on">
                      <v-list-item-content>
                        <v-list-item-title>
                          <user-avatar :user="item" :size="40"></user-avatar>
                          {{ `${item.firstName} ${item.lastName}` }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-combobox>

                <v-combobox
                    :rules="observerRules"
                    color="action"
                    v-model="task.data.observers"
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
                      <user-avatar :user="data.item"></user-avatar>
                      {{ data.item.firstName }}
                    </v-chip>
                  </template>
                  <template v-slot:item="{ attrs, on, item }">
                    <v-list-item :key="item.id" dense v-on="on">
                      <v-list-item-content>
                        <v-list-item-title>
                          <user-avatar :user="item" :size="40"></user-avatar>
                          {{ `${item.firstName} ${item.lastName}` }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-combobox>

                <v-combobox
                    v-if="task.action === 'update'"
                    :rules="taskStatusRules"
                    v-model="task.data.status"
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
        <v-btn class="action" :disabled="!valid" dark text @click="actionTask()">{{ task.buttonTitle }}</v-btn>
        <v-btn class="action" dark text @click="task.active = false">Назад</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import store from "@/store";
  import dateformat from "dateformat";
  import { mapState, mapGetters } from "vuex";
  import task from "@/mixins/utils/task";
  import taskUtil from "@/mixins/utils/task"
  export default {
    name: "createUpdateTask",
    mixins: [taskUtil],
    data(){
      return {
        filesInput: [],
        valid: false,
        dateFormat: "yyyy-mm-dd",
        timeFormat: "HH:MM:ss",
        datePicker: null,
        timePicker: null,
        menuDatePicker: false,
        menuTimePicker: false,
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
          v => {
            if(typeof v === 'object' && v !== null){
              return true
            } else return 'Такого пользователя не существует'
          },
        ],
        observerRules: [
          v => {
          let validation = false

            if(v !== null){
              v.forEach((value) => {
                if(typeof value === 'object' && value !== null){
                  validation = true
                } else validation = 'Такого пользователя не существует'
              })
            }

            return validation
          },
        ],
        taskStatusRules: [
          v => !!v || 'Это поле обязательно для заполнения',
        ],
      }
    },
    computed: {
      ...mapState({
        files: state => state.tasks.taskFiles,
        task: state => state.tasks.dialogCreateUpdateTask,
        allTaskStatus: state => state.tasks.allTaskStatus,
        loadingCreateUpdateTask: state => state.tasks.loadingCreateUpdateTask,

        allUsers: state => state.users.users
      }),
      vProgressLinear: vm => ({
        absolute: true,
        top: true,
        height: 7
      }),
    },
    watch: {
      ['task.action'](newValue, oldValue){
        if(newValue === 'create'){
          if(this.$refs.form){
            this.$refs.form.reset()
          }
          this.datePicker = null
          this.timePicker = null
        } else {
          this.datePicker = this.task.data.dueDate.date
          this.timePicker = this.task.data.dueDate.time
        }
        console.log(oldValue, 'oldValue')
        console.log(newValue, 'newValue')
      }
    },
    methods: {
      saveDate(){
        let date = new Date(this.datePicker)
        this.task.data.dueDate.date = dateformat(date, this.dateFormat)

        this.menuDatePicker = false;
      },
      saveTime(){
        this.task.data.dueDate.time = this.timePicker

        this.menuTimePicker = false;
      },
      emojiAdded(emoji){
        this.task.data.description += emoji
      },
      loadFiles(files){
        this.task.data.files = this.task.data.files.concat(files)

        if(files.length > 0) {
          this.filesInput = []
        }
      },
      removeFile(index){
        this.task.data.files.splice(index, 1);
      }
    }
  }
</script>

<style>

</style>