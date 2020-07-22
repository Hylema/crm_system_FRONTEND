import Vue from 'vue'
import { Api } from '../../constants'

const state = {
    token: localStorage.getItem('access_token') || null,
    refresh: localStorage.getItem('refresh_token') || null,
};

const actions = {
    async login ({ commit }, params){
        return await Vue.axios.post(Api.AUTH, params).then(response => {

            Vue.notify({
                group: 'Api',
                title: '200',
                text: 'Авторизация прошла успешно',
                type: 'success',
                duration: 10000
            });

            commit('login', response);
            commit('setToken');
        }).catch(error => {
            Vue.notify({
                group: 'Api',
                title: '401',
                text: 'Происходит втирание',
                type: 'error',
                duration: 10000
            });
        })
        // return new Promise((resolve, reject) => {
        //     timeout(3000).then(() => {
        //         localStorage.setItem('access_token', 'params');
        //         Vue.notify({
        //             group: 'Api',
        //             title: '200',
        //             text: 'Авторизация прошла успешно',
        //             type: 'success',
        //             duration: 1000000
        //         });
        //         commit('login', 'params');
        //         resolve('params')
        //     })
        // });
    },
    logout({ commit }){
        localStorage.removeItem('access_token');

        Vue.notify({
            group: 'Api',
            title: '200',
            text: 'Вы успешно вышли',
            type: 'success',
            duration: 1000000
        });

        commit('logout');
    },
    async tokenVerify({ commit }) {
        return await Vue.axios.post(Api.TOKEN_VERIFY, {
            token: state.token
        }).then(response => {

            Vue.notify({
                group: 'Api',
                title: '200',
                text: 'Проверка токена прошла успешно',
                type: 'success',
                duration: 10000
            });

            commit('setToken');

            return true;
        }).catch(error => {
            Vue.notify({
                group: 'Api',
                title: '400',
                text: 'Проверка токена не прошла',
                type: 'error',
                duration: 10000
            });

            return false;
        })
    },
    async getTokenByRefresh({ commit }) {
        return await Vue.axios.post(Api.REFRESH_TOKEN, {
            refresh: state.refresh
        }).then(response => {

            Vue.notify({
                group: 'Api',
                title: '200',
                text: 'Замена токена прошел успешно',
                type: 'success',
                duration: 10000
            });

            commit('login', response);
            commit('setToken');
        }).catch(error => {
            Vue.notify({
                group: 'Api',
                title: '400',
                text: error,
                type: 'error',
                duration: 10000
            });

            // commit('logout');
        })
    },
};

const mutations = {
    login(state, response){
        let access = response.data.access
        let refresh = response.data.refresh

        localStorage.setItem('access_token', access)
        localStorage.setItem('refresh_token', refresh)

        state.token = access
        state.refresh = refresh
    },
    logout(state){
        state.token = null;
    },
    setToken(state){
        Vue.axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    }
};

const getters = {
    loggedIn(){
        return state.token;
    }
};

export default {
    state,
    getters,
    actions,
    mutations,
    namespaced: true
}

// "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
//     "Access-Control-Allow-Headers": "Origin, Content-Type, Accept, Authorization, X-Request-With",
//     "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTk1MzUzNzM2LCJqdGkiOiI1ZGM1OTAzNGVmNzI0N2JhOTg5ZmViOGU2ZTA0NzExNiIsInVzZXJfaWQiOjF9.JPJjxnDYIxrGctBj2QpP8Ce07M_nvkNWmpfwREX3uZQ",
//     'Accept': 'application/json'