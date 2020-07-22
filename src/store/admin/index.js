import Vue from 'vue'
import { Api } from '../../constants'

const state = {
    users: []
};

const actions = {
    async getAllUsers({ commit }){
        return await Vue.axios.get(Api.GET_All_USERS).then(response => {
            Vue.notify({
                group: 'Api',
                title: '200',
                text: 'Все пользователи успешно получены',
                type: 'success',
                duration: 10000
            });

            commit('setUsers', response)

            console.log(response, 'response');
        }).catch(error => {
            Vue.notify({
                group: 'Api',
                title: '401',
                text: 'Не удалось получить пользователей',
                type: 'error',
                duration: 10000
            });
        })
    },
    async createUser({ commit }, body){
        return await Vue.axios.post(Api.CREATE_USER, body).then(response => {
            Vue.notify({
                group: 'Api',
                title: response.status,
                text: 'Пользователь успешно создан',
                type: 'success',
                duration: 10000
            });
            console.log(response, 'response');

            return true;
        }).catch(error => {
            Vue.notify({
                group: 'Api',
                title: `${error.response.status}`,
                text: 'Не удалось создать ползователя',
                type: 'error',
                duration: 10000
            });

            return false;
        })
    },
    async updateUser({ commit }, params){

        return await Vue.axios.put(`${Api.UPDATE_USER}${params.id}`, params.data).then(response => {
            Vue.notify({
                group: 'Api',
                title: response.status,
                text: 'Пользователь успешно обновлен',
                type: 'success',
                duration: 10000
            });

            console.log(response, 'response');

            return true;
        }).catch(error => {
            Vue.notify({
                group: 'Api',
                title: `${error.response.status}`,
                text: 'Не удалось обновить ползователя',
                type: 'error',
                duration: 10000
            });

            return false;
        })
    },
    async deleteUser({ commit }, id){
        await Vue.axios.delete(`${Api.DELETE_USER}${id}`).then(response => {
            Vue.notify({
                group: 'Api',
                title: response.status,
                text: 'Пользователь успешно удален',
                type: 'success',
                duration: 10000
            });

            console.log(response, 'response');

            return true;
        }).catch(error => {
            Vue.notify({
                group: 'Api',
                title: `${error.response.status}`,
                text: 'Не удалось удалить ползователя',
                type: 'error',
                duration: 10000
            });

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