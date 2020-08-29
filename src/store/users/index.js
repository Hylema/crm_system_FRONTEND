import Vue from 'vue'
import { Api } from '@/constants'
import { sendMessage } from '@/util/ws'

const state = {
    users: []
};

const actions = {};

const mutations = {
    setUsers(state, users){
        state.users = users
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