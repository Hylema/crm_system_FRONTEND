<template>
  <v-card class="tableColor overflow-hidden card-width" v-bind:style="window.width < 1485 && 1260 < window.width ? {height: 'calc(100vh - 85px)'} : 1265 > window.width ? 550 > window.width ? {height: '100%'} : {height: 'calc(100vh - 65px)'} : {height: 'calc(100vh - 70px)'}">
    <v-card-title>
      <v-layout row justify-start>
        <v-tooltip bottom open-delay="500">
          <template v-slot:activator="{ on }">
            <v-btn class="mx-2" fab dark small color="action" v-on="on">
              {{ listLength }}
            </v-btn>
          </template>
          <span>Кол-во задач в этом разделе</span>
        </v-tooltip>
        <div style="overflow: hidden">{{ status.name }}</div>
      </v-layout>
    </v-card-title>
    <v-card-text style="overflow-y: auto">
      <draggable
          :disabled="window.width < 800"
          ghost-class="ghost"
          v-bind:style="window.width > 550 ? {height: 'calc(100vh - 85px)'} : {height: '100%'}"
          class="list-group mt-3"
          v-model="list"
          v-bind="dragOptions"
          @start="drag = true"
          @end="drag = false"
          @change="moveTask"
      >
        <div
            v-for="task in list"
            :key="task.order"
            style="padding: 10px 0;"
        >
          <v-hover
              v-slot:default="{ hover }"
              :value="drag"
          >
            <v-card
                :color="getColorDate(task.dueDate)"
                :elevation="drag ? 0 : hover ? 12 : 0"
                hover
                class="mx-auto v-card-cursor"
                height="auto"
                max-width="400"
                @click="openTask(task)"
            >
              <transition name="fade">
                <div style="position: absolute; right: -15px; top: -15px" v-if="hover">
                  <v-btn fab color="action" small class="mr-1" dark @click.stop="preEditTask(task)">
                    <v-icon small>
                      mdi-pencil
                    </v-icon>
                  </v-btn>

                  <v-btn fab color="action" small dark @click.stop="deleteTask(task)">
                    <v-icon small>
                      mdi-delete
                    </v-icon>
                  </v-btn>
                </div>
              </transition>
              <!--                            <v-img-->
              <!--                                    class="white&#45;&#45;text align-end"-->
              <!--                                    height="100px"-->
              <!--                                    src="https://www.ejin.ru/wp-content/uploads/2019/05/gora-22.jpg"-->
              <!--                            ></v-img>-->
              <v-card-title>{{ task.title }}</v-card-title>

              <v-card-text class="text--primary">
                {{ task.description }}
              </v-card-text>
            </v-card>
          </v-hover>
          <!--                    <v-card-->
          <!--                            :class="-->
          <!--                element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'-->
          <!--              "-->
          <!--                            @click="element.fixed = !element.fixed"-->
          <!--                            aria-hidden="true"-->
          <!--                    ></v-card>-->
        </div>
      </draggable>
    </v-card-text>
  </v-card>
</template>

<script>
import windowSize from '../../mixins/windowSize'
import draggable from 'vuedraggable'
import getColorForTask from "@/mixins/getColorForTask";
import store from "@/store";
import {mapState} from "vuex";
import taskUtil from "@/mixins/utils/task"
export default {
  name: "draggable_tasks",
  props: {
    status: Object,
    dragOptions: Object,
    list: Array
  },
  components: {
    draggable,
  },
  mixins: [windowSize, getColorForTask, taskUtil],
  data() {
    return {
      drag: false,
    }
  },
  computed: {
    ...mapState({
      dialogDetailsTask: state => state.tasks.dialogDetailsTask,
    }),
    listLength: vm => vm.list.length,
  },
  methods: {
    moveTask(event, originalEvent){
      if(event.added){
        this.$stomp.send("/app/patchTask", {},  JSON.stringify({
          id: event.added.element.id,
          status: this.status.id
        }))
      }
    },
  }
}
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
    opacity: 0;
  }
  .ghost {
    opacity: 0.4;
  }
  .card-width{
    width: 400px;
    min-width: 400px;
  }
  @media only screen and (max-width: 500px) {
    .card-width{
      width: 97%;
      min-width: 97%;
    }
  }
</style>