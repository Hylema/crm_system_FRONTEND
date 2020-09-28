import Vue from 'vue'

const state = {
    themeIsDark: localStorage.getItem('dark_theme') !== 'false',
    drawerThemeIsMini: localStorage.getItem('drawerIsMini') !== 'false',
};

const actions = {
    setTheme({ commit, rootState }, value){
        console.log(rootState, 'rootState')
        commit('changeTheme', value);
    },

    setDrawerTheme({ commit, rootState }, value){
        commit('changeDrawerTheme', value);
    }
};

const mutations = {
    changeTheme(state, value){
        localStorage.setItem('dark_theme', value);
        state.themeIsDark = value;
    },

    changeDrawerTheme(state, value){
        localStorage.setItem('drawerIsMini', value);
        state.drawerThemeIsMini = value;
    },
};

const getters = {
    themeIsDark: state => state.themeIsDark,
    drawerThemeIsMini: state => state.drawerThemeIsMini,
};

export default {
    state,
    actions,
    mutations,
    getters,
    namespaced: true
}
