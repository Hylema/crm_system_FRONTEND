import Vue from 'vue'
import { Api } from '@/constants'
import store from "@/store";

const state = {
    task_dialog: false,
    loadingDetails: false,
    loadingComment: false,
    loadingTasks: false,
    loadingActionTask: false,
    taskDetails: {},
    tasks: [],
    allTaskStatus: [],
    files: []
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
};

const mutations = {
    loadingDetails(state, value){
        state.loadingDetails = value;
    },
    loadingComment(state, value){
        state.loadingComment = value;
    },
    loadingTasks(state, value){
        state.loadingTasks = value;
    },
    loadingActionTask(state, value){
        state.loadingActionTask = value;
    },


    dialogState(state, value){
        state.task_dialog = value;
    },

    createTask(state, task){
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
                Vue.delete(state.users, i, task)
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
    addFile(state, file){
        state.files.push(file);
    },
    clearFiles(state){
        state.files = [];
    },
};

const getters = {
    task_dialog: state => state.task_dialog,
    tasks: state => state.tasks,
    allTaskStatus: state => state.allTaskStatus,
    taskDetails: state => state.taskDetails,
    loadingDetails: state => state.loadingDetails,
    loadingComment: state => state.loadingComment,
    loadingTasks: state => state.loadingTasks,
    loadingActionTask: state => state.loadingActionTask,
    filesCount: state => state.files.length,
};

export default {
    state,
    getters,
    actions,
    mutations,
    namespaced: true
}