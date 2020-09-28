import Vue from 'vue'
import { Api } from '@/constants'

const state = {
    token: localStorage.getItem('access_token') || null,
    refresh: localStorage.getItem('refresh_token') || null,
};

const actions = {
    async login ({ commit, dispatch }, params){
        return await Vue.axios.post(Api.AUTHORIZATION.AUTH, params).then(response => {
            dispatch('getCurrentAuthUser')
            commit('login', response);
            commit('setToken');

            return response
        }).catch(error => {
            throw error.response.data
        })
    },
    async tokenVerify({ commit, dispatch }) {
        return await Vue.axios.post(Api.AUTHORIZATION.TOKEN_VERIFY, {
            token: state.token
        }).then(response => {
            commit('setToken');
            return true;
        }).catch(error => {
            return false;
        })
    },
    async getTokenByRefresh({ commit, dispatch }) {
        return await Vue.axios.post(Api.AUTHORIZATION.REFRESH_TOKEN, {
            refresh: state.refresh
        }).then(response => {
            dispatch('getCurrentAuthUser')
            commit('login', response);
            commit('setToken');
            return true;
        }).catch(error => {
             commit('logout');

            return false
        })
    },
    async getCurrentAuthUser({ commit, dispatch }) {
        return await Vue.axios.get(Api.AUTHORIZATION.USER).then(response => {
            commit('user/setUser', response.data, {
                root: true
            });
            return true;
        }).catch(error => {
            // commit('logout');

            return false
        })
    },
};

const mutations = {
    login(state, response){
        let access = response.data.access_token
        let refresh = response.data.refresh_token

        localStorage.setItem('access_token', access)
        localStorage.setItem('refresh_token', refresh)

        state.token = access
        state.refresh = refresh
    },
    logout(state){
        state.token = null;
        state.refresh = null;

        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        localStorage.removeItem('admin')
    },
    setToken(state){
        Vue.axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    },
    // setUser(state, user){
    //     console.log('user', user)
    //     localStorage.setItem('user', JSON.stringify(user))
    //     state.user = user
    //
    //     Vue.set(state.user, user)
    //
    //     if(user.roles != null){
    //         const roles = user.roles
    //
    //         roles.forEach((role) => {
    //             if(role.role === 'ROLE_ADMIN'){
    //                 localStorage.setItem('admin', true)
    //
    //                 state.isAdmin = true
    //             }
    //         })
    //     }
    // },
};

const getters = {
    token: state => state.token,
    refresh: state => state.refresh,
    // getCurrentUser: state => {
    //     if(state.user != null) {
    //         try {
    //             return JSON.parse(state.user)
    //         } catch (e) {
    //             return state.user
    //         }
    //     }
    //
    //     return null
    // },
    // currentUserIsAdmin: state => {
    //     console.log(state.isAdmin)
    //
    //     return state.isAdmin
    // }
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