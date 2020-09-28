<template>
  <v-container v-if="taskDetails.length !== 0">
    <v-card color="tableColor" style="margin: 13px">
      <v-card-title class="headline tableColor p-3">{{ taskDetails.title }}</v-card-title>
    </v-card>

     <v-layout justify-space-around v-if="taskDetails.comments">
        <v-flex sm12 md7 class="mr-4 ml-3">
          <v-card color="tableColor" height="100%">
            <v-card-text>
              <h4>Комментарии</h4>
            </v-card-text>

            <!--Список комментариев-->
              <v-list v-if="taskDetails.comments.length > 0" class="tableColor" dense >
                <v-list-item v-for="comment in taskDetails.comments">
                  <user-avatar :user="comment.author"></user-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ comment.author.firstName }} {{ comment.author.lastName }} | {{ comment.created | dateFilter }}</v-list-item-title>
                    <v-list-item-subtitle>{{ comment.text }}</v-list-item-subtitle>

                    <v-list v-if="comment.files != null" style="width: 100%;" class="tableColor">
                      <v-list-item v-for="file in comment.files">
                        <v-list-item-content>
                          <v-img width="100%" :src="file.download" @click="showImage(file)" ></v-img>
                          <v-btn dark text link :href="file.download" class="action">{{ file.name }}</v-btn>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <v-card-text v-else>
                <div>На данный момент нет ниодного комментария</div>
              </v-card-text>

            <!--Поле для комментария-->
              <v-card-text class="tableColor">
                <v-textarea
                    dense
                    v-model="comment.text"
                    label="Добавить комментарий..."
                    color="action"
                    outlined
                    :loading="loadingComment"
                    :append-icon="'mdi-map-marker-off'"
                >
                  <template v-slot:append>
                    <v-layout row style="width: 39px;">
                      <v-flex md12>
                        <v-file-input hide-input style="margin: 0 !important; padding: 0 !important;" @change="loadFiles" multiple v-model="filesInput"></v-file-input>
                      </v-flex>
                      <v-flex class="mt-1">
                        <twemoji v-on:emojiAdded="emojiAdded"></twemoji>
                      </v-flex>
                    </v-layout>
                  </template>
                </v-textarea>

                <task-files :files="comment.files" v-on:removeFile="removeFile"></task-files>

                <v-btn block class="action" dark @click="makeComment()" large :loading="loadingComment" :disabled="checkComment()">Отправить</v-btn>
              </v-card-text>
          </v-card>
        </v-flex>

        <v-flex sm12 md5 class="mr-3">
          <v-card color="tableColor" class="p-3">
            <div class="mb-10">
              <h4>Описание</h4><v-divider></v-divider>
              <span>
              {{ taskDetails.description }}
            </span>
            </div>

            <div class="mb-10">
              <h4>Автор</h4><v-divider></v-divider>
              <user-avatar :user="taskDetails.author"></user-avatar>

              <strong class="m-lg-1" style="font-size: 20px">{{ `${taskDetails.author.firstName} ${taskDetails.author.lastName}` }}</strong>
            </div>


            <div class="mb-10 mt-10">
              <h4>Исполнитель</h4><v-divider></v-divider>
              <user-avatar :user="taskDetails.responsible"></user-avatar>

              <strong class="m-lg-1" style="font-size: 20px">{{ `${taskDetails.responsible.firstName} ${taskDetails.responsible.lastName}` }}</strong>
            </div>


            <div class="mb-10 mt-10" v-if="taskDetails.observers.length > 0">
              <h4>Наблюдатели</h4><v-divider></v-divider>

              <user-avatar v-for="observer in taskDetails.observers" :user="observer"></user-avatar>
            </div>

            <v-divider></v-divider>

            <div class="mb-10" v-if="taskDetails.files !== null && taskDetails.files.length !== 0">
              <h4>Прикрепленные файлы</h4><v-divider></v-divider>

              <div v-for="file in taskDetails.files" class="m-2">
                <v-btn text link :href="file.download">{{ file.name }}</v-btn>
              </div>
            </div>

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
          </v-card>
        </v-flex>
      </v-layout>

  </v-container>
</template>

<script>
  import windowSize from "@/mixins/windowSize";
  import taskUtil from "@/mixins/utils/task";
  import dropZone from "@/components/dropZone/dropZone";
  import {mapState} from "vuex";
  import store from "@/store";

  export default {
    name: "TaskDetails",
    mixins: [windowSize, taskUtil],
    components: {
      dropZone
    },
    data(){
      return {
        filesInput: [],
        emojiPicker: false,
        needData: false,
        status: [],
        comments: [],
        taskStatusRules: [
          v => !!v || 'Это поле обязательно для заполнения',
        ],
      }
    },
    activated(){
      if(this.WSIsConnected){
        this.getTaskDetails(this.urlId)
      } else {
        this.needData = true
      }
    },
    // mounted() {
    //
    // },
    watch: {
      WSIsConnected(newValue, oldValue) {
        if(newValue && this.needData) {
          this.getTaskDetails(this.urlId)
          this.needData = false
        }
      }
    },
    computed: {
      ...mapState({
        taskDetails: state => state.tasks.taskDetails,
        comment: state => state.tasks.comment,
        WSIsConnected: state => state.ws.WSIsConnected
      }),
      urlId: vm => vm.$route.params.id,
      loadingDetails: vm => vm.$store.getters["tasks/loadingDetails"],
      loadingComment: vm => vm.$store.getters["tasks/loadingComment"],
      filesCount: vm => vm.$store.getters["tasks/filesCount"],
      allTaskStatus: vm => vm.$store.getters["tasks/allTaskStatus"],
      user: vm => vm.$store.getters["user/currentUser"],
    },
    methods: {
      loadFile(files){
        if(files !== null){
          this.$store.commit('tasks/addFile', files)
        }
      },
      loadFiles(files){
        if(files !== null){
          this.$store.commit('tasks/addFilesForComment', files)

          if(files.length > 0) {
            this.filesInput = []
          }
        }
      },
      emojiAdded(emoji){
        this.comment.text += emoji
      },
      checkComment(){
        return !(this.comment.files.length > 0 || (this.comment.text.length !== null && this.comment.text !== ''));
      },
      showImage(file){
        window.open(file.path, '_blank')
      },
      removeFile(index){
        this.$store.commit('tasks/removeCommentFileByIndex', index)
      }
    }
  }
</script>

<style scoped>

</style>