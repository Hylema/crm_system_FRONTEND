import Vue from 'vue'
import { Api } from '../../constants'

const state = {
    users: []
};

const actions = {
    async getAllUsers({ commit, dispatch }){
        return await Vue.axios.get(Api.GET_All_USERS).then(response => {
            commit('setUsers', response)

        }).catch(error => {

        })
    },
    async createUser({ commit, dispatch }, body){
        return await Vue.axios.post(Api.CREATE_USER, body).then(response => {
            return true;
        }).catch(error => {
            return false;
        })
    },
    async updateUser({ commit, dispatch }, params){
        return await Vue.axios.put(`${Api.UPDATE_USER}${params.id}`, params.data).then(response => {
            return true;
        }).catch(error => {
            return false;
        })
    },
    async deleteUser({ commit, dispatch }, id){
        await Vue.axios.delete(`${Api.DELETE_USER}${id}`).then(response => {
            return true;
        }).catch(error => {
            return false;
        })
    },
};

const mutations = {
    setUsers(state, response){
        state.users = response.data;
    },
};

const getters = {
    users: state => state.users,
};

export default {
    state,
    getters,
    actions,
    mutations,
    namespaced: true
}