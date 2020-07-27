import Vue from 'vue'
import { Api } from '../../constants'

const state = {
    task_dialog: false,
    allTasks: []
};

const actions = {
    async getAllTasks({ commit, dispatch }){
        return await Vue.axios.get(Api.GET_ALL_TASKS).then(response => {
            dispatch('notification/createNotification', {
                api: Api.GET_ALL_TASKS,
                params: {},
                response: response,
                text: 'Все задачи успешно получены',
            }, { root: true })

            commit('setTasks', response);
        }).catch(error => {
            dispatch('notification/createNotification', {
                api: Api.GET_ALL_TASKS,
                params: {},
                response: error.response,
                text: 'Не удалось получить все задачи',
            }, { root: true })
        })
    },
};

const mutations = {
    dialogState(state, value){
        state.task_dialog = value;
    },
    setTasks(state, tasks){
        state.allTasks = tasks;
    }
};

const getters = {
    task_dialog: state => state.task_dialog,
    all_tasks: state => state.allTasks
};

export default {
    state,
    getters,
    actions,
    mutations,
    namespaced: true
}