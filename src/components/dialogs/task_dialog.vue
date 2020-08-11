<template>
  <v-dialog
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
        <v-card-title class="headline">{{ taskDetails.name }}</v-card-title>
        <v-card-title><v-btn class="mx-2" fab dark small color="action" @click="task_dialog = false"><v-icon>close</v-icon></v-btn></v-card-title>
      </v-layout>

      <v-divider style="margin: 0px"></v-divider>

      <v-layout justify-space-around wrap class="p-2" v-if="taskDetails.comments">
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
          <v-card-text v-for="comment in taskDetails.comments.slice().reverse()">
            <div>{{ comment.comment | capitalize }}</div>
            <v-divider></v-divider>
          </v-card-text>

          <v-card-text>
            <v-textarea
                dense
                v-model="textComment"
                label="Добавить комментарий..."
                outlined
                :loading="loadingComment"
                :append-icon="'mdi-map-marker-off'"
            >
              <template v-slot:append>
                <v-icon>mdi-paperclip</v-icon>
                <v-icon>mdi-emoticon-happy-outline</v-icon>
              </template>
            </v-textarea>
            <v-btn block class="action" dark @click="makeComment()">Отправить</v-btn>
          </v-card-text>
        </v-flex>

        <v-flex sm12 md5>
          <h4>Статус</h4>
          <v-overflow-btn
              dense
              class="my-2"
              :items="dropdown_font"
              label="Статус"
          ></v-overflow-btn>

          <div class="p-2 mb-1">
            <h4>Автор</h4>
            <v-avatar color="action" size="40">
              <v-icon dark>mdi-account-circle</v-icon>
            </v-avatar>

            <strong class="m-lg-1">{{ taskDetails.author }}</strong>
          </div>

          <div class="p-2 mb-1">
            <h4>Исполнитель</h4>
            <v-avatar color="action" size="40">
              <v-icon dark>mdi-account-circle</v-icon>
            </v-avatar>

            <strong class="m-lg-1">{{ taskDetails.responsible }}</strong>
          </div>

          <div class="p-2 mb-1" v-if="taskDetails.observer.length > 0">
            <h4>Наблюдатели</h4>
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
      comments: [],
      textComment: null,
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
    taskDetails: vm => vm.$store.getters["tasks/taskDetails"],
    loadingDetails: vm => vm.$store.getters["tasks/loadingDetails"],
    loadingComment: vm => vm.$store.getters["tasks/loadingComment"],
    vProgressLinear: vm => ({
      absolute: true,
      top: true,
      // color: theme.actions,
      height: 7
    }),
  },
  methods: {
    makeComment(){
      this.$store.dispatch('tasks/makeComment', {
        comment: this.textComment,
        task: this.taskDetails.id
      }).then(ok => {
        if(ok){
          this.textComment = null
        }
      })
    }
  }
}
</script>

<style scoped>

</style>