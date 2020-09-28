import Vue from 'vue'
import { Api } from '@/constants'

const state = {
    WSIsConnected: false
};

const actions = {};

const mutations = {
    WSConnect(state, bool){
        state.WSIsConnected = bool
    },
};

const getters = {};

export default {
    state,
    getters,
    actions,
    mutations,
    namespaced: true
}