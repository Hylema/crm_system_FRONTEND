import Vue from 'vue'
import { Api } from '../../constants'

const state = {
    task_dialog: false,
    allTasks: []
};

const actions = {
    async getAllTasks({ commit }){
        return await Vue.axios.get(Api.GET_ALL_TASKS).then(response => {
            Vue.notify({
                group: 'Api',
                title: '200',
                text: 'Все задачи успешно получены',
                type: 'success',
                duration: 10000
            });

            commit('setTasks', response);

            console.log(response, 'response');
        }).catch(error => {
            Vue.notify({
                group: 'Api',
                title: '401',
                text: error,
                type: 'error',
                duration: 10000
            });
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