import Vue from 'vue'

const state = {
    themeIsDark: localStorage.getItem('dark_theme') !== 'false',
};

const actions = {
    setTheme({ commit }, value){
        localStorage.setItem('dark_theme', value);
        commit('changeTheme', value);
    },
};

const mutations = {
    changeTheme(state, value){
        state.themeIsDark = value;
    },
};

const getters = {
    themeIsDark: state => state.themeIsDark,
};

export default {
    state,
    actions,
    mutations,
    getters,
    namespaced: true
}
