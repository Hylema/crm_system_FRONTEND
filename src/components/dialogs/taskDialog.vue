<!--<template>-->
<!--  <v-dialog-->
<!--      v-if="taskDetails !== null"-->
<!--      v-model="dialogDetailsTask.active"-->
<!--      :fullscreen="window.width<=700"-->
<!--      width="70%"-->
<!--  >-->
<!--    <v-card color="background">-->
<!--      <v-progress-linear-->
<!--          color="action"-->
<!--          v-bind="vProgressLinear"-->
<!--          :active="loadingDetails"-->
<!--          :indeterminate="loadingDetails"-->
<!--      ></v-progress-linear>-->
<!--      <v-layout justify-space-between>-->
<!--        <v-card-title class="headline">{{ taskDetails.title }}</v-card-title>-->
<!--        <v-card-title><v-btn class="mx-2" fab dark small color="action" @click="dialogDetailsTask.active = false"><v-icon>close</v-icon></v-btn></v-card-title>-->
<!--      </v-layout>-->

<!--      <v-divider style="margin: 0px"></v-divider>-->

<!--      <v-layout justify-space-around v-if="taskDetails.comments">-->
<!--        <v-flex sm12 md7 class="mr-4">-->
<!--          <v-card-text>-->
<!--            <h4>Комментарии</h4>-->
<!--          </v-card-text>-->

<!--          <v-list v-if="taskDetails.comments.length > 0" class="background" dense>-->
<!--              <v-list-item v-for="comment in taskDetails.comments">-->
<!--                <user-avatar :user="comment.author"></user-avatar>-->
<!--                <v-list-item-content>-->
<!--                  <v-list-item-title>{{ comment.author.firstName }} {{ comment.author.lastName }} | {{ comment.created | dateFilter }}</v-list-item-title>-->
<!--                  <v-list-item-subtitle>{{ comment.text }}</v-list-item-subtitle>-->

<!--                  <v-list v-if="comment.files != null" style="width: 100%;" class="background">-->
<!--                    <v-list-item v-for="file in comment.files">-->
<!--                      <v-list-item-content>-->
<!--                        <v-img width="100%" :src="file.download" @click="showImage(file)" ></v-img>-->
<!--                        <v-btn dark text link :href="file.download" class="action">{{ file.name }}</v-btn>-->
<!--                      </v-list-item-content>-->
<!--                    </v-list-item>-->
<!--                  </v-list>-->
<!--                </v-list-item-content>-->
<!--              </v-list-item>-->
<!--          </v-list>-->

<!--          <v-card-text v-else>-->
<!--            <span>На данный момент нет ниодного комментария</span>-->
<!--          </v-card-text>-->

<!--          <v-divider></v-divider>-->

<!--          <v-card-text>-->
<!--            <v-textarea-->
<!--                dense-->
<!--                v-model="textComment"-->
<!--                label="Добавить комментарий..."-->
<!--                color="action"-->
<!--                outlined-->
<!--                :loading="loadingComment"-->
<!--                :append-icon="'mdi-map-marker-off'"-->
<!--            >-->
<!--              <template v-slot:append>-->
<!--                <v-layout row style="width: 39px;">-->
<!--                  <v-flex md12>-->
<!--                    <v-file-input hide-input style="margin: 0 !important; padding: 0 !important;" @change="loadFiles" multiple></v-file-input>-->
<!--                  </v-flex>-->
<!--                  <v-flex class="mt-1">-->
<!--                    <twemoji v-on:emojiAdded="emojiAdded"></twemoji>-->
<!--                  </v-flex>-->
<!--                </v-layout>-->
<!--              </template>-->
<!--            </v-textarea>-->

<!--            <task-files :files="files" v-on:removeFile="removeFile"></task-files>-->

<!--            <v-btn block class="action" dark @click="makeComment()" large :loading="loadingComment" :disabled="checkComment()">Отправить</v-btn>-->
<!--          </v-card-text>-->
<!--        </v-flex>-->

<!--        <v-flex sm12 md5 class="p-4">-->
<!--          <v-combobox-->
<!--              :rules="taskStatusRules"-->
<!--              v-model="taskDetails.status"-->
<!--              :item-text="'name'"-->
<!--              color="action"-->
<!--              outlined-->
<!--              :items="allTaskStatus"-->
<!--              label="Статус"-->
<!--              @input="handlerInputStatus"-->
<!--          ></v-combobox>-->

<!--          <div class="mb-10">-->
<!--            <h4>Описание</h4><v-divider></v-divider>-->

<!--            <span>-->
<!--              {{ taskDetails.description }}-->
<!--            </span>-->
<!--          </div>-->

<!--          <div class="mb-10" v-if="taskDetails.files !== null">-->
<!--            <h4>Прикрепленные файлы</h4><v-divider></v-divider>-->

<!--            <div v-for="file in taskDetails.files" class="m-2">-->
<!--              <v-btn text link :href="file.download">{{ file.name }}</v-btn>-->
<!--            </div>-->
<!--          </div>-->

<!--          <div class="mb-10">-->
<!--            <h4>Автор</h4><v-divider></v-divider>-->
<!--            <user-avatar :user="taskDetails.author"></user-avatar>-->

<!--            <strong class="m-lg-1" style="font-size: 20px">{{ `${taskDetails.author.firstName} ${taskDetails.author.lastName}` }}</strong>-->
<!--          </div>-->


<!--          <div class="mb-10 mt-10">-->
<!--            <h4>Исполнитель</h4><v-divider></v-divider>-->
<!--            <user-avatar :user="taskDetails.responsible"></user-avatar>-->

<!--            <strong class="m-lg-1" style="font-size: 20px">{{ `${taskDetails.responsible.firstName} ${taskDetails.responsible.lastName}` }}</strong>-->
<!--          </div>-->


<!--          <div class="mb-10 mt-10" v-if="taskDetails.observers.length > 0">-->
<!--            <h4>Наблюдатели</h4><v-divider></v-divider>-->

<!--            <v-tooltip bottom v-for="observer in taskDetails.observers">-->
<!--              <template v-slot:activator="{ on, attrs }">-->
<!--                <span-->
<!--                    v-bind="attrs"-->
<!--                    v-on="on"-->
<!--                >-->
<!--                  <user-avatar-->
<!--                      :user="observer"-->
<!--                  ></user-avatar>-->
<!--                </span>-->
<!--              </template>-->
<!--              <strong>{{ `${observer.lastName} ${observer.firstName}` }}</strong>-->
<!--            </v-tooltip>-->
<!--          </div>-->

<!--          <v-divider></v-divider>-->

<!--          <div class="sc-jrsTQk fVBwUq">-->
<!--            <div class="sc-ftesFE vcMHC">-->
<!--              <small class="sc-ivQgGC kwlxKn">-->
<!--                <span>Создано {{ taskDetails.created | dateFilter }}</span>-->
<!--              </small>-->
<!--            </div>-->
<!--            <div class="sc-ftesFE vcMHC">-->
<!--              <small class="sc-ivQgGC kwlxKn">-->
<!--                <span>Обновлено {{ taskDetails.updated | dateFilter }}</span>&nbsp;-->
<!--              </small>-->
<!--            </div>-->
<!--          </div>-->
<!--        </v-flex>-->
<!--      </v-layout>-->
<!--    </v-card>-->
<!--  </v-dialog>-->
<!--</template>-->

<!--<script>-->
<!--import windowSize from '../../mixins/windowSize'-->
<!--import dropZone from '../dropZone/dropZone'-->
<!--import {mapState} from "vuex";-->
<!--import taskUtil from "@/mixins/utils/task"-->

<!--export default {-->
<!--  name: "taskDialog",-->
<!--  mixins: [windowSize, taskUtil],-->
<!--  components: {-->
<!--    dropZone-->
<!--  },-->
<!--  data(){-->
<!--    return {-->
<!--      emojiPicker: false,-->
<!--      status: [],-->
<!--      comments: [],-->
<!--      textComment: '',-->
<!--      taskStatusRules: [-->
<!--        v => !!v || 'Это поле обязательно для заполнения',-->
<!--      ],-->
<!--    }-->
<!--  },-->
<!--  computed: {-->
<!--    ...mapState({-->
<!--      dialogDetailsTask: state => state.tasks.dialogDetailsTask,-->
<!--      files: state => state.tasks.commentFiles-->
<!--    }),-->
<!--    taskDetails: vm => {-->
<!--      const task = vm.$store.getters["tasks/taskDetails"]-->

<!--      if(task.length > 0){-->
<!--        this.status = task.status-->
<!--      }-->

<!--      return vm.$store.getters["tasks/taskDetails"]-->
<!--    },-->
<!--    loadingDetails: vm => vm.$store.getters["tasks/loadingDetails"],-->
<!--    loadingComment: vm => vm.$store.getters["tasks/loadingComment"],-->
<!--    filesCount: vm => vm.$store.getters["tasks/filesCount"],-->
<!--    allTaskStatus: vm => vm.$store.getters["tasks/allTaskStatus"],-->
<!--    user: vm => vm.$store.getters["user/currentUser"],-->
<!--    vProgressLinear: vm => ({-->
<!--      absolute: true,-->
<!--      top: true,-->
<!--      // color: theme.actions,-->
<!--      height: 7-->
<!--    }),-->
<!--  },-->
<!--  methods: {-->
<!--    loadFile(files){-->
<!--      if(files !== null){-->
<!--        this.$store.commit('tasks/addFile', files)-->
<!--      }-->
<!--    },-->
<!--    loadFiles(files){-->
<!--      if(files !== null){-->
<!--        this.$store.commit('tasks/addFilesForComment', files)-->
<!--      }-->
<!--    },-->
<!--    emojiAdded(emoji){-->
<!--      this.textComment += emoji-->
<!--    },-->
<!--    checkComment(){-->
<!--      return !(this.files.length > 0 || (this.textComment.length !== null && this.textComment !== ''));-->
<!--    },-->
<!--    showImage(file){-->
<!--      window.open(file.path, '_blank')-->
<!--    },-->
<!--    removeFile(index){-->
<!--      this.$store.commit('tasks/removeCommentFileByIndex', index)-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style>-->

<!--</style>-->