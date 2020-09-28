import Vue from 'vue'
import { Api } from '@/constants'

const state = {
    users: []
};

const actions = {
    async getAllUsers({ commit, dispatch }){
        return await Vue.axios.get(Api.USERS.GET_All_USERS).then(response => {
            commit('setUsers', response)
        }).catch(error => {

        })
    },
    async createUser({ commit, dispatch }, body){
        return await Vue.axios.post(Api.USERS.CREATE_USER, body).then(response => {
            return true;
        }).catch(error => {
            return false;
        })
    },
    async updateUser({ commit, dispatch }, params){
        return await Vue.axios.put(`${Api.USERS.UPDATE_USER}${params.id}`, params.data).then(response => {
            dispatch("getAllUsers")
            return true;
        }).catch(error => {
            return false;
        })
    },
    async patchUser({ commit, dispatch }, params){
        return await Vue.axios.patch(`${Api.USERS.PATCH_USER}${params.id}`, params.data).then(response => {
            return true;
        }).catch(error => {
            return false;
        })
    },
    async deleteUser({ commit, dispatch }, id){
        return await Vue.axios.delete(`${Api.USERS.DELETE_USER}${id}`).then(response => {
            return true;
        }).catch(error => {
            return false;
        })
    },
};

const mutations = {
    setUsers(state, users){
        state.users = users
    },
    updateUser(state, user){
        let users = state.users

        for (let i = 0; i < state.users.length; i++ ) {
            if (users[i].id === user.id) {
                Vue.set(state.users, i, user)
            }
        }
    },
    createUser(state, user){
        state.users.push(user);
    },
    deleteUser(state, user){
        let users = state.users

        for (let i = 0; i < state.users.length; i++ ) {
            if (users[i].id === user.id) {
                console.log(2, users[i])
                Vue.delete(state.users, i, user)
            }
        }
    }
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