import Vue from 'vue'
import { Api } from '@/constants'

const state = {
    loadingPage: false
};

const actions = {};

const mutations = {
    loadingPage(state, bool){
        state.loadingPage = bool
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