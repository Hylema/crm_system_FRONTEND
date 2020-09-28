import dateformat from "dateformat";
import store from "@/store";
import {mapState, mapGetters} from "vuex";

export default {
    data(){
      return {
          createTaskModel: {
              title: '',
              description: '',
              dueDate: null,
              responsible: null,
              observers: [],
              files: []
          },
          editTaskModel: {
              id: null,
              title: '',
              description: '',
              dueDate: null,
              responsible: null,
              observers: [],
              status: null,
              files: []
          },
          dateFormat: "yyyy-mm-dd",
          timeFormat: "HH:MM:ss",
      }
    },
    computed: {
        ...mapState({
            task: state => state.tasks.dialogCreateUpdateTask,
            comment: state => state.tasks.comment,
            taskFiles: state => state.tasks.taskFiles,
        }),
        filters: vm => vm.$store.getters["tasks/filters"],

    },
    methods: {
        preEditTask (task) {
            this.$store.dispatch('tasks/preUpdateTaskDialog', task)
        },
        preCreateTask(){
            this.$store.dispatch("tasks/preCreateTaskDialog")
        },
        filter(filter){
            this.$store.dispatch("tasks/filters", filter)

            console.log(this.filters, 'this.filters')

            if(Object.keys(this.filters).length > 0){
                this.$stomp.send("/app/getAllTask", {}, JSON.stringify(this.filters))
            } else {
                this.$stomp.send("/app/getAllTask")
            }
        },
        deleteTask (task) {
            confirm('Are you sure you want to delete this task?') && this.$stomp.send("/app/deleteTask", {}, JSON.stringify({
                id: task.id
            }))
        },
        async makeComment(){
            this.$store.commit('tasks/loadingComment', true)

            let message = {
                text: this.comment.text,
                taskId: this.taskDetails.id
            }

            if(this.comment.files.length > 0){
                await this.$store.dispatch('tasks/uploadCommentFiles').then(response => {
                    console.log(response, 'Полученный файл')
                    const files = response.data;

                    if(Array.isArray(files)){
                        message['files'] = files.map(file => {
                            return file.id
                        })
                    }
                }).catch(err => message = null)
            }

            console.log(message, 'message')

            this.$stomp.send("/app/makeComment", {},  JSON.stringify(message))
        },
        handlerInputStatus(item){
            this.$stomp.send("/app/patchTask", {},  JSON.stringify({
                id: this.taskDetails.id,
                status: item.id
            }))
        },
        actionTask(){
            if(this.task.action === 'update') this.updateTask();
            else this.createTask();
        },
        openTask(task){
            this.$router.push({path: `/tasks/${task.id}`}).catch(()=>{})
        },
        getTaskDetails(taskId){
            store.commit("loading/loadingPage", true)

            this.$stomp.subscribe(`/task/${taskId}/comments`, response => {
                store.commit("tasks/makeComment", JSON.parse(response.body))
            })

            this.$stomp.subscribe(`/task/${taskId}/details`, response => {

                store.commit("loading/loadingPage", false)
                store.commit("tasks/taskDetails", JSON.parse(response.body))
            })

            this.$stomp.send(`/app/task/details`, {}, JSON.stringify({
                id: taskId
            }))
        },
        async createTask () {
            let task = await this.prepareTask(this.createTaskModel)
            this.$store.commit('tasks/loadingActionTask', true)

            console.log(task, 'final TASK')
            this.$stomp.send("/app/createTask", {}, JSON.stringify(task))
        },
        async updateTask(){
            const task = await this.prepareTask(this.editTaskModel)
            this.$store.commit('tasks/loadingActionTask', true)

            console.log("updateTask", task)
            this.$stomp.send("/app/updateTask", {}, JSON.stringify(task))
        },
        async prepareTask(model){
            const editedTask = this.task.data
            const arrayModels = Object.assign(Object.keys(model))

            let object = {};

            await Promise.all(arrayModels.map(async key => {
                switch (key){
                    case 'dueDate': {
                        const date = new Date(`${editedTask[key].date} ${editedTask[key].time}`)

                        const dateFormat = dateformat(date, this.dateFormat)
                        const timeFormat = dateformat(date, this.timeFormat)

                        object[key] = `${dateFormat}T${timeFormat}Z`
                    } break
                    case 'responsible': object[key] = editedTask[key].id; break
                    case 'observers': object[key] = editedTask[key].map(observer => observer.id); break
                    case 'status': object[key] = editedTask[key].id; break
                    case 'files': object[key] = await this.checkFiles(editedTask[key]); break
                    default: object[key] = editedTask[key]
                }
            }))

            return object
        },
        async checkFiles(taskFiles){
            let newFiles = []
            let newFilesIndex = []
            let files = new Array(...taskFiles)

            files.forEach((file, index) => {
                if(file.id === undefined){
                    newFiles.push(file)
                    newFilesIndex.push(index)
                }
            })

            if(newFilesIndex.length > 0){
                newFilesIndex.reverse().forEach((value, index) => {
                    files.splice(value, 1);
                })
            }

            if(newFiles.length > 0){
                console.log(newFiles, 'newFiles')
                await this.$store.dispatch('tasks/uploadTaskFiles', newFiles).then(response => {
                    const result = response.data;

                    if(Array.isArray(result)){
                        files = files.concat(result)
                    }
                }).catch(err => files = null)
            }

            console.log(taskFiles, 'taskFiles')
            console.log(files, 'files')

            return files.map(file => file.id)
        }
    }
}