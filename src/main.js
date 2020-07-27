import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import plugins from './plugins'
import backToTop from './components/backButton/back_button'
import { Api } from './constants'

Vue.config.productionTip = false

Vue.component('back-to-top', backToTop)

Vue.axios.defaults.baseURL = 'http://193.176.79.41';

// let performed = true
//
// Vue.axios.interceptors.request.use(async function (config) {
//   if(!config.headers['Authorization']){
//     if(!performed){
//       performed = true
//
//       await store.dispatch('auth/tokenVerify').then(async res => {
//         if(!res) await store.dispatch('auth/getTokenByRefresh').then(res => {
//           return config.headers['Authorization'] = `Bearer ${store.getters['auth/loggedIn']}`
//         })
//         else return config.headers['Authorization'] = `Bearer ${store.getters['auth/loggedIn']}`
//       })
//     }
//   }
//
//   return config;
// },  (error) => {
//
//   return Promise.reject(error);
// });

Vue.axios.interceptors.response.use(function (response) {

  Vue.notify({
    group: 'Api',
    title: `${response.status}`,
    data: response,
    text: getSuccessTitle(response.config.url),
    type: 'success',
    duration: 1000000
  });

  return response;
}, async (error) => {

  Vue.notify({
    group: 'Api',
    title: `${error.response.status}`,
    data: error.response,
    text: getErrorTitle(error.response.config.url),
    type: 'error',
    duration: 1000000
  });

//&& error.response.config.url !== Api.AUTH && error.response.config.url !== Api.TOKEN_VERIFY
  if(error.response.status === 401 && error.response.config.url !== Api.TOKEN_VERIFY){
    return await store.dispatch('auth/tokenVerify').then(async tokenVerifyIsValid => {
      if(!tokenVerifyIsValid) return await store.dispatch('auth/getTokenByRefresh').then(async refreshTokenSuccess => {
        if(refreshTokenSuccess) {
          error.response.config.headers['Authorization'] = `Bearer ${store.getters['auth/loggedIn']}`
          return await Vue.axios.request(error.response.config).then(response => Promise.resolve(response)).catch(error => Promise.reject(error))
        }
      })
      else {
        error.response.config.headers['Authorization'] = `Bearer ${store.getters['auth/loggedIn']}`
        return await Vue.axios.request(error.response.config).then(response => Promise.resolve(response)).catch(error => Promise.reject(error))
      }
    })

    //return await Vue.axios.request(error.response.config).then(response => Promise.resolve(response)).catch(error => Promise.reject(error))
  } else {
    return Promise.reject(error);
  }
});

function  getSuccessTitle(url) {
  switch (url) {
    case Api.AUTH: return 'Авторизация прошла успешно';
    case Api.TOKEN_VERIFY: return 'Проверка токена прошла успешно';
    case Api.REFRESH_TOKEN: return 'Замена токена прошел успешно';
    case Api.GET_All_USERS: return 'Пользователи успешно получены';
    case Api.CREATE_USER: return 'Пользователь успешно создан';
    case Api.UPDATE_USER: return 'Пользователь успешно обновлен';
    case Api.DELETE_USER: return 'Пользователь успешно удален';
    case Api.GET_ALL_TASKS: return 'Все задачи успешно получены';
    default: return 'Неизвестное успешное действие';
  }
}

function  getErrorTitle(url) {
  switch (url) {
    case Api.AUTH: return `Не удалось авторизироваться`;
    case Api.TOKEN_VERIFY: return `Проверка токена не прошла`;
    case Api.REFRESH_TOKEN: return 'Не удалось заменить токен';
    case Api.GET_All_USERS: return 'Не удалось получить пользователей';
    case Api.CREATE_USER: return 'Не удалось создать ползователя';
    case Api.UPDATE_USER: return 'Не удалось обновить ползователя';
    case Api.DELETE_USER: return 'Не удалось удалить ползователя';
    case Api.GET_ALL_TASKS: return 'Не удалось получить все задачи';
    default: return 'Неизвестная ошибка';
  }
}

new Vue({
  router,
  store,
  ...plugins,
  render: h => h(App)
}).$mount('#app')
