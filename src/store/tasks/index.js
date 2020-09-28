import Vue from 'vue'
import { Api } from '@/constants'
import store from "@/store";
import dateformat from "dateformat";

const state = {
    dialogCreateUpdateTask: {
        active: false,
        title: '',
        buttonTitle: '',
        action: null,
        dateFormat: "yyyy-mm-dd",
        timeFormat: "HH:MM:ss",
        data: null,
    },

    dialogDetailsTask: {
        active: false
    },

    filters: {
        author: null,
        responsible: null,
        observers: null,
        deleted: false,
        status: null,
        search: null
    },

    loadingDetails: false,
    loadingComment: false,
    loadingTasks: false,
    loadingCreateUpdateTask: false,
    loadingTaskFiles: false,

    taskDetails: {},
    tasks: [],
    allTaskStatus: [],
    comment: {
        files: [],
        text: ''
    },
    taskFiles: []
};

const actions = {
    async getAllTasks({ commit, dispatch }){
        commit('loadingTasks', true);

        let res = await Vue.axios.get(Api.TASKS.GET_ALL_TASKS).then(response => {
            commit('setTasks', response);
            return true;
        }).catch(error => {
            return false;
        })

        commit('loadingTasks', false);

        return res;

    },
    async getTaskDetails({ commit, dispatch }, data){
        commit('loadingDetails', true);
        commit('dialogState', true);
        commit('clearFiles');

        if(!data.update){
            commit('taskDetails', {});
        }

        let res = await Vue.axios.get(`${Api.GET_TASK_DETAILS}/${data.id}`).then(response => {
            commit('taskDetails', response.data);
            return true;
        }).catch(error => {
            return false;
        })

        commit('loadingDetails', false);

        return res;
    },
    async createTask({ commit, dispatch }, data){
        commit('loadingCreateTask', true);

        let res = await Vue.axios.post(Api.CREATE_TASK, data).then(async response => {
            dispatch('getAllTasks')
            return true
        }).catch(error => {
            return false;
        })

        commit('loadingCreateTask', false);

        return res;
    },
    async makeComment({ commit, dispatch }, data){
        commit('loadingComment', true);

        let formData = new FormData();

        formData.append('task', data.task)
        formData.append('comment', data.comment)

        if(state.files.length > 0){
            state.files.forEach((file) => formData.append('file', file))
        }

        console.log(formData.entries(), 'formData')
        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]);
        }

        let res = await Vue.axios.post(Api.MAKE_TASK_COMMENT, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(async response => {
            return await dispatch('getTaskDetails', {
                id: data.task,
                update: true
            }).then(response => true)
        }).catch(error => {
            return false;
        })

        commit('loadingComment', false);

        return res;
    },

    // async downloadTaskCommentFile({ commit, dispatch }, file){
    //     return dispatch('files/downloadFile', file, {
    //         root: true
    //     })
    // },

    async uploadTaskFiles({ commit, dispatch }, files){
        return dispatch('files/uploadsFiles', files, {
            root: true
        })
    },

    async uploadCommentFiles({ commit, dispatch }){
        return dispatch('files/uploadsFiles', state.comment.files, {
            root: true
        })
    },

    preCreateTaskDialog({ commit, dispatch }) {
        commit('dialogCreateUpdateTaskAction', 'create')
        commit('dialogCreateUpdateTaskTitle', 'Создание задачи')
        commit('dialogCreateUpdateTaskButtonTitle', 'Создать')
        commit('dialogTaskResetData')
        commit('dialogCreateUpdateTask', true)
    },

    preUpdateTaskDialog({ commit, dispatch }, task) {
        commit('dialogCreateUpdateTaskAction', 'update')
        commit('dialogCreateUpdateTaskTitle', 'Редактирование задачи')
        commit('dialogCreateUpdateTaskButtonTitle', 'Изменить')
        commit('dialogTaskResetData')
        commit('dialogUpdateTaskData', task)
        commit('dialogCreateUpdateTask', true)
    },

    filters({ commit, dispatch }, filter){
        commit("loadingTasks", true)
        commit('filter', filter)
    },

    createdCommentSuccessFromWS({ commit, dispatch, getters, rootGetters }, comment){
        commit('clearComment')
        commit('loadingComment', false)
    },



    async createdTaskFromWS({ commit, dispatch, getters, rootGetters }, task){
        const checker = await dispatch('checkerCurrentFilters', task)

        Vue.notify({
            group: 'User',
            title: `Задачи`,
            data: task,
            text: 'Была создана новая задача, где вы являетесь её участником',
            type: 'success',
            duration: 20000
        });

        console.log(checker, 'checker CREATE')

        if(checker.status){
            commit('createdTask', task)
        }
    },
    async updatedTaskFromWS({ commit, dispatch, getters, rootGetters }, task){
        const checker = await dispatch('checkerCurrentFilters', task)

        Vue.notify({
            group: 'User',
            title: `Задачи`,
            data: task,
            text: 'Задача была обновлена',
            type: 'success',
            duration: 20000
        });

        console.log(checker, 'checker UPDATE')

        if(checker.status){
            commit('updateTask', task)
        } else {
            commit('deleteTask', task)
        }
    },
    async deletedTaskFromWS({ commit, dispatch, getters, rootGetters }, task){
        const checker = await dispatch('checkerCurrentFilters', task)

        Vue.notify({
            group: 'User',
            title: `Задачи была удалена`,
            data: task,
            text: `Задача была удалена`,
            type: 'success',
            duration: 20000
        });

        console.log(checker, 'checker DELETE')

        if(checker.status){
            commit('createdTask', task)
        } else if(!checker.status && checker.deleted !== null && checker.deleted !== undefined){
            commit('deleteTask', task)
        }
    },
    checkerCurrentFilters({ commit, dispatch, getters, rootGetters }, task){
        const currentFilters = getters['filters']
        const currentUser = rootGetters['user/currentUser']

        let checker = {
            status: true
        }

        if(currentFilters.deleted !== undefined){
            if(task.deleteStatus !== currentFilters.deleted){
                checker.status = false
                checker['deleted'] = currentFilters.deleted
            }
        }

        if(currentFilters.status !== undefined){
            if(task.status.id !== currentFilters.status.id){
                checker.status = false
                checker['status'] = currentFilters.status
            }
        }

        if(currentFilters.author !== undefined && currentFilters.author !== false){
            if(task.author.id !== currentUser.id){
                checker.status = false
                checker['author'] = currentFilters.author
            }
        }

        if(currentFilters.responsible !== undefined && currentFilters.responsible !== false){
            if(task.responsible.id !== currentUser.id){
                checker.status = false
                checker['responsible'] = currentFilters.responsible
            }
        }

        if(currentFilters.observers !== undefined && currentFilters.observers !== false){
            let currentUserIsObserver = false

            task.observers.forEach(observer => {
                if(observer.id === currentUser.id){
                    currentUserIsObserver = true
                }
            })

            if(!currentUserIsObserver){
                checker.status = false
                checker['observers'] = currentFilters.observers
            }
        }

        return checker
    },
};

const mutations = {
    dialogCreateUpdateTask(state, bool){
        state.dialogCreateUpdateTask.active = bool
    },
    dialogCreateUpdateTaskTitle(state, title){
        state.dialogCreateUpdateTask.title = title
    },
    dialogCreateUpdateTaskAction(state, string){
        state.dialogCreateUpdateTask.action = string
    },
    dialogCreateUpdateTaskButtonTitle(state, buttonTitle){
        state.dialogCreateUpdateTask.buttonTitle = buttonTitle
    },
    dialogUpdateTaskData(state, data){
        let task = state.dialogCreateUpdateTask.data

        if(data != null && task != null){

            console.log(data, 'data')

            task.id = data.id;
            task.title = data.title;
            task.description = data.description;
            task.responsible = data.responsible;
            task.observers = data.observers;
            task.status = data.status;
            task.files = data.files

            let date = new Date(data.dueDate)

            task.dueDate.date = `${dateformat(date, state.dialogCreateUpdateTask.dateFormat)}`
            task.dueDate.time = `${dateformat(date, state.dialogCreateUpdateTask.timeFormat)}`
        }

        console.log(state.dialogCreateUpdateTask, 'state.dialogCreateUpdateTask')
    },
    dialogTaskResetData(state, data){
        state.dialogCreateUpdateTask.data = {
            id: null,
            title: '',
            description: '',
            dueDate: {
                date: '',
                time: ''
            },
            responsible: null,
            observers: null,
            status: null,
            files: []
        }
        console.log(state.dialogCreateUpdateTask.data, 'state.dialogCreateUpdateTask.data')
    },

    dialogDetailsTask(state, value){
        state.dialogDetailsTask = value
    },



    loadingDetails(state, value){
        state.loadingDetails = value
    },
    loadingComment(state, value){
        state.loadingComment = value
    },
    loadingTasks(state, value){
        state.loadingTasks = value
    },
    loadingActionTask(state, value){
        state.loadingCreateUpdateTask = value
    },
    loadingTaskFiles(state, value){
        state.loadingTaskFiles = value
    },

    clearComment(state, value){
        state.comment.text = ''
        state.comment.files = []
    },

    createdTask(state, task){
        state.tasks.push(task)
    },
    updateTask(state, task){
        let tasks = state.tasks

        for (let i = 0; i < state.tasks.length; i++ ) {
            if (tasks[i].id === task.id) {
                Vue.set(state.tasks, i, task)
            }
        }
    },
    deleteTask(state, task){
        let tasks = state.tasks

        for (let i = 0; i < state.tasks.length; i++ ) {
            if (tasks[i].id === task.id) {
                Vue.delete(state.tasks, i, task)
            }
        }
    },
    makeComment(state, comment){
        console.log(comment, 'comment')
        state.taskDetails.comments.push(comment)
    },
    setStatus(state, status){
        state.allTaskStatus = status
    },

    setTasks(state, tasks){
        console.log("tasks", tasks)
        state.tasks = tasks;
    },
    taskDetails(state, details){
        console.log("details", details)
        state.taskDetails = details;
    },


    addFilesForComment(state, files){
        state.comment.files = state.comment.files.concat(files)
        console.log(state.comment.files, 'commentFiles')
    },
    // addFilesForTask(state, files){
    //     state.taskFiles = state.taskFiles.concat(files)
    // },
    clearCommentFiles(state){
        state.comment.files = [];
    },
    // clearTaskFiles(state){
    //     state.taskFiles = [];
    // },
    removeCommentFileByIndex(state, index){
        state.comment.files.splice(index, 1);
    },


    filter(state, filter) {
        const key = Object.keys(filter)[0]
        const value = Object.values(filter)[0]

        console.log(key, 'key')
        console.log(value, 'value')

        if(key === 'all'){
            state.filters = {
                author: null,
                responsible: null,
                observers: null,
                deleted: false,
                status: null,
            }
        } else {
            state.filters[key] = value
        }
    }
};

const getters = {
    dialogDetailsTask: state => state.dialogDetailsTask,
    dialogCreateUpdateTask: state => state.dialogCreateUpdateTask,

    loadingDetails: state => state.loadingDetails,
    loadingComment: state => state.loadingComment,
    loadingTasks: state => state.loadingTasks,
    loadingActionTask: state => state.loadingCreateUpdateTask,

    tasks: state => state.tasks,
    task: state => state.dialogCreateUpdateTask,
    filters: state => {
        let filters = {}

        Object.keys(state.filters).map((key, index) => {
            if(state.filters[key] !== null && state.filters[key] !== undefined){
                filters[key] = state.filters[key]
            }
        })

        return filters
    },
    allTaskStatus: state => state.allTaskStatus,
    taskDetails: state => state.taskDetails,
    filesCount: state => state.files.length,
};

export default {
    state,
    getters,
    actions,
    mutations,
    namespaced: true
}