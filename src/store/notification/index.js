import Vue from 'vue'
import { Api } from '../../constants'

const state = {
    json_dialog: false,
    json_data: {},
};

const actions = {
    showJson({ commit }, params){
        commit('set_json_data', params.json)
        commit('json_dialog', params.dialog)
    },
};

const mutations = {
    set_json_data(state, object){
        state.json_data = object;
    },
    json_dialog(state, value){
        state.json_dialog = value;
    },
};

const getters = {
    json_dialog: () => state.json_dialog,
    json_data: () => state.json_data,

};

export default {
    state,
    getters,
    actions,
    mutations,
    namespaced: true
}