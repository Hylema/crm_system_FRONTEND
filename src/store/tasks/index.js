import Vue from 'vue'
import { Api } from '../../constants'

const state = {
    task_dialog: false,
    loadingDetails: false,
    loadingComment: false,
    loadingTasks: false,
    loadingCreateTask: false,
    taskDetails: {},
    allTasks: []
};

const actions = {
    async getAllTasks({ commit, dispatch }){
        commit('loadingTasks', true);

        let res = await Vue.axios.get(Api.GET_ALL_TASKS).then(response => {
            commit('setTasks', response);
            return true;
        }).catch(error => {
            return false;
        })

        commit('loadingTasks', false);

        return res;

    },
    async getTaskDetails({ commit, dispatch }, data){
        commit('dialogState', true);
        commit('loadingDetails', true);
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

        let res = await Vue.axios.post(Api.MAKE_TASK_COMMENT, data).then(async response => {
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
    dialogState(state, value){
        state.task_dialog = value;
    },
    setTasks(state, tasks){
        state.allTasks = tasks.data;
    },
    taskDetails(state, details){
        state.taskDetails = details;
    },
    loadingDetails(state, value){
        state.loadingDetails = value;
    },
    loadingComment(state, value){
        state.loadingComment = value;
    },
    loadingTasks(state, value){
        state.loadingComment = value;
    },
    loadingCreateTask(state, value){
        state.loadingCreateTask = value;
    },
};

const getters = {
    task_dialog: state => state.task_dialog,
    all_tasks: state => state.allTasks,
    taskDetails: state => state.taskDetails,
    loadingDetails: state => state.loadingDetails,
    loadingComment: state => state.loadingComment,
    loadingTasks: state => state.loadingTasks,
    loadingCreateTask: state => state.loadingCreateTask,
};

export default {
    state,
    getters,
    actions,
    mutations,
    namespaced: true
}