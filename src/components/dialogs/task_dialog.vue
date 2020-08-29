<template>
  <div>
    <v-dialog
        v-if="taskDetails !== null"
        v-model="task_dialog"
        :fullscreen="window.width<=700"
        width="1000"
    >
      <v-card color="background">
        <v-progress-linear
            color="action"
            v-bind="vProgressLinear"
            :active="loadingDetails"
            :indeterminate="loadingDetails"
        ></v-progress-linear>
        <v-layout justify-space-between>
          <v-card-title class="headline">{{ taskDetails.title }}</v-card-title>
          <v-card-title><v-btn class="mx-2" fab dark small color="action" @click="task_dialog = false"><v-icon>close</v-icon></v-btn></v-card-title>
        </v-layout>

        <v-divider style="margin: 0px"></v-divider>

        <v-layout justify-space-around v-if="taskDetails.comments">
          <v-flex sm12 md7>
            <v-card-text>
              <h4>Описание</h4>
            </v-card-text>
            <v-card-text>
              {{ taskDetails.description }}
            </v-card-text>

            <v-divider></v-divider>

            <v-card-text>
              <h4>Комментарии</h4>
            </v-card-text>
            <v-card-text v-if="taskDetails.comments.length > 0">
              <div v-for="comment in taskDetails.comments">
                <div v-if="currentAuthUser.id === comment.author.id">
                  <v-card class="mt-2" style="max-width: 80%; margin-left: auto">
                    <v-card-title style="font-size: 16px">
                      <v-avatar color="action mr-2" size="30">
                        <v-icon dark>mdi-account-circle</v-icon>
                      </v-avatar>
                      {{ comment.author.firstName }}
                      <v-spacer></v-spacer>
                      {{ comment.created | dateFilter }}
                    </v-card-title>
                    <v-card-text>
                      {{ comment.text }}
                    </v-card-text>
                  </v-card>
                </div>
                <div v-else>
                  <v-card class="mt-2" style="max-width: 80%">
                    <v-card-title style="font-size: 16px">
                      <v-avatar color="action mr-2" size="30">
                        <v-icon dark>mdi-account-circle</v-icon>
                      </v-avatar>
                      {{ comment.author.firstName }}
                      <v-spacer></v-spacer>
                      {{ comment.created | dateFilter }}
                    </v-card-title>
                    <v-card-text>
                      {{ comment.text }}
                    </v-card-text>
                  </v-card>
                </div>
              </div>
            </v-card-text>

            <v-card-text v-else>
              <span>На данный момент нет ниодного комментария</span>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-text>
              <v-textarea
                  dense
                  v-model="textComment"
                  label="Добавить комментарий..."
                  color="action"
                  outlined
                  :loading="loadingComment"
                  :append-icon="'mdi-map-marker-off'"
              >
                <template v-slot:append>
                  <span class="mt-sm-1" v-if="filesCount > 0">{{ filesCount }}</span><v-icon @click.stop="sheet = true">mdi-paperclip</v-icon>

<!--                  <v-menu-->
<!--                      bottom-->
<!--                      origin="center center"-->
<!--                      transition="slide-x-transition"-->
<!--                      min-width="100%"-->
<!--                      :close-on-content-click="false"-->
<!--                  >-->
<!--                    <template v-slot:activator="{ on, attrs }">-->
<!--                      <v-icon>mdi-paperclip</v-icon>-->
<!--                    </template>-->

<!--                    <dropZone></dropZone>-->
<!--                  </v-menu>-->

                  <v-icon>mdi-emoticon-happy-outline</v-icon>
                </template>
              </v-textarea>
              <v-btn block class="action" dark @click="makeComment()">Отправить</v-btn>
            </v-card-text>
          </v-flex>

          <v-flex sm12 md5 class="p-4">
            <v-combobox
                :rules="taskStatusRules"
                v-model="taskDetails.status"
                :item-text="'name'"
                color="action"
                outlined
                :items="allTaskStatus"
                label="Статус"
                @input="handlerInputStatus"
            ></v-combobox>

            <div class="mb-10">
              <h4>Автор</h4><v-divider></v-divider>
              <v-avatar color="action" size="40">
                <v-icon dark>mdi-account-circle</v-icon>
              </v-avatar>

              <strong class="m-lg-1" style="font-size: 20px">{{ `${taskDetails.author.firstName} ${taskDetails.author.lastName}` }}</strong>
            </div>


            <div class="mb-10 mt-10">
              <h4>Исполнитель</h4><v-divider></v-divider>
              <v-avatar color="action" size="40">
                <v-icon dark>mdi-account-circle</v-icon>
              </v-avatar>

              <strong class="m-lg-1" style="font-size: 20px">{{ `${taskDetails.author.firstName} ${taskDetails.author.lastName}` }}</strong>
            </div>


            <div class="mb-10 mt-10" v-if="taskDetails.observers.length > 0">
              <h4>Наблюдатели</h4><v-divider></v-divider>

              <v-tooltip bottom v-for="observer in taskDetails.observers">
                <template v-slot:activator="{ on, attrs }">
                  <v-avatar
                      color="action"
                      size="40"
                      v-bind="attrs"
                      v-on="on"
                  >
                    <v-icon dark>mdi-account-circle</v-icon>
                  </v-avatar>
                </template>
                <strong>{{ `${observer.lastName} ${observer.firstName}` }}</strong>
              </v-tooltip>
            </div>

            <v-divider></v-divider>
            <div class="sc-jrsTQk fVBwUq">
              <div class="sc-ftesFE vcMHC">
                <small class="sc-ivQgGC kwlxKn">
                  <span>Создано {{ taskDetails.created | dateFilter }}</span>
                </small>
              </div>
              <div class="sc-ftesFE vcMHC">
                <small class="sc-ivQgGC kwlxKn">
                  <span>Обновлено {{ taskDetails.updated | dateFilter }}</span>&nbsp;
                </small>
              </div>
            </div>
          </v-flex>

        </v-layout>
      </v-card>
    </v-dialog>

    <v-bottom-sheet v-model="sheet">
      <dropZone></dropZone>
    </v-bottom-sheet>
  </div>
</template>

<script>
import windowSize from '../../mixins/windowSize'
import dropZone from '../dropZone/dropZone'

// import data from '../data/all.json'
// import { Picker, EmojiIndex } from 'emoji-mart-vue-fast'
// let emojiIndex = new EmojiIndex(data)
export default {
  name: "task_dialog",
  mixins: [windowSize],
  components: {
    dropZone
  },
  data(){
    return {
      status: [],
      comments: [],
      textComment: null,
      sheet: false,
      taskStatusRules: [
        v => !!v || 'Это поле обязательно для заполнения',
      ],
    }
  },
  filters: {
    reverse: function (array) {
      return array.slice().reverse()
    }
  },
  computed: {
    task_dialog: {
      get(){
        return this.$store.getters["tasks/task_dialog"];
      },
      set (value) {
        this.$store.commit('tasks/dialogState', value)
      }
    },
    taskDetails: vm => {
      const task = vm.$store.getters["tasks/taskDetails"]

      if(task.length > 0){
        this.status = task.status
      }

      return vm.$store.getters["tasks/taskDetails"]
    },
    loadingDetails: vm => vm.$store.getters["tasks/loadingDetails"],
    loadingComment: vm => vm.$store.getters["tasks/loadingComment"],
    filesCount: vm => vm.$store.getters["tasks/filesCount"],
    allTaskStatus: vm => vm.$store.getters["tasks/allTaskStatus"],
    currentAuthUser: vm => vm.$store.getters["auth/getCurrentUser"],
    vProgressLinear: vm => ({
      absolute: true,
      top: true,
      // color: theme.actions,
      height: 7
    }),
  },
  methods: {
    makeComment(){
      this.$stomp.send("/app/makeComment", {},  JSON.stringify({
        text: this.textComment,
        taskId: this.taskDetails.id
      }))

      this.textComment = ''

      // this.$store.dispatch('tasks/makeComment', {
      //   comment: this.textComment,
      //   task: this.taskDetails.id
      // }).then(ok => {
      //   if(ok){
      //     this.textComment = null
      //   }
      // })
    },
    handlerInputStatus(item){
      this.$stomp.send("/app/patchTask", {},  JSON.stringify({
        id: this.taskDetails.id,
        status: item.id
      }))
    }
  }
}
</script>

<style>

</style>