import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import {Api} from "@/constants";
import store from "@/store";
import { BackendUrl } from "@/constants";

Vue.use(VueAxios, axios)

Vue.axios.defaults.baseURL = `${BackendUrl}/`;

Vue.axios.interceptors.response.use(function (response) {

    if(response.status){
        Vue.notify({
            group: 'Api',
            title: `${response.status}`,
            data: response,
            text: getSuccessTitle(response.config.url),
            type: 'success',
            duration: 1000000
        });
    }

    return response;
}, async (error) => {
    console.log(error, "=========================================")

    if(error.response){
        Vue.notify({
            group: 'Api',
            title: `${error.response.status}`,
            data: error.response,
            text: getErrorTitle(error.response.config.url),
            type: 'error',
            duration: 1000000
        });
    }

//&& error.response.config.url !== Api.AUTH && error.response.config.url !== Api.TOKEN_VERIFY
    if((error.response.status === 401 || error.response.status === 403) && (error.response.config.url !== Api.AUTHORIZATION.TOKEN_VERIFY && error.response.config.url !== Api.AUTHORIZATION.REFRESH_TOKEN)){
        return await store.dispatch('auth/tokenVerify').then(async tokenVerifyIsValid => {
            if(!tokenVerifyIsValid) return await store.dispatch('auth/getTokenByRefresh').then(async refreshTokenSuccess => {
                if(refreshTokenSuccess) {
                    error.response.config.headers['Authorization'] = `Bearer ${store.getters['auth/loggedIn']}`
                    return await Vue.axios.request(error.response.config).then(response => Promise.resolve(response)).catch(error => Promise.reject(error))
                }
            })
            else {
                if(!error.response.config.headers['Authorization']){
                    error.response.config.headers['Authorization'] = `Bearer ${store.getters['auth/loggedIn']}`
                    return await Vue.axios.request(error.response.config).then(response => Promise.resolve(response)).catch(error => Promise.reject(error))
                }
            }
        })

        //return await Vue.axios.request(error.response.config).then(response => Promise.resolve(response)).catch(error => Promise.reject(error))
    } else {
        return Promise.reject(error);
    }
});

function  getSuccessTitle(url) {
    switch (url) {
        case Api.AUTHORIZATION.AUTH: return 'Авторизация прошла успешно';
        case Api.AUTHORIZATION.TOKEN_VERIFY: return 'Проверка токена прошла успешно';
        case Api.AUTHORIZATION.REFRESH_TOKEN: return 'Замена токена прошел успешно';

        case Api.GET_All_USERS: return 'Пользователи успешно получены';
        case Api.CREATE_USER: return 'Пользователь успешно создан';
        case Api.UPDATE_USER: return 'Пользователь успешно обновлен';
        case Api.DELETE_USER: return 'Пользователь успешно удален';

        case Api.GET_ALL_TASKS: return 'Все задачи успешно получены';
        case Api.GET_TASK_DETAILS: return 'Детали такска успешно получены'
        default: return 'Неизвестное успешное действие';
    }
}

function  getErrorTitle(url) {
    switch (url) {
        case Api.AUTHORIZATION.AUTH: return `Не удалось авторизироваться`;
        case Api.AUTHORIZATION.TOKEN_VERIFY: return `Проверка токена не прошла`;
        case Api.AUTHORIZATION.REFRESH_TOKEN: return 'Не удалось заменить токен';

        case Api.GET_All_USERS: return 'Не удалось получить пользователей';
        case Api.CREATE_USER: return 'Не удалось создать ползователя';
        case Api.UPDATE_USER: return 'Не удалось обновить ползователя';
        case Api.DELETE_USER: return 'Не удалось удалить ползователя';

        case Api.GET_ALL_TASKS: return 'Не удалось получить все задачи';
        case Api.GET_TASK_DETAILS: return 'Не удалось получить детали таска'
        default: return 'Неизвестная ошибка';
    }
}