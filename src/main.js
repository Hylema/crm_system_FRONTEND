import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import plugins from './plugins'
import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
import { BackendUrl } from "@/constants";
Vue.config.productionTip = false

if(store.getters["auth/loggedIn"] === null){
  store.dispatch("auth/getCurrentAuthUser").then(() => stompConnect())
} else {
  stompConnect()
}

function stompConnect(){
  const stomp = Stomp.over(() => new SockJS(`${BackendUrl}/aegis_crm_system`))
  Vue.prototype.$stomp = stomp;

  stomp.connect({"Authorization": store.getters["auth/loggedIn"]}, frame => {
    store.commit("tasks/loadingTasks", true)

    console.log('connected success')

    stomp.subscribe('/user/getAll', response => {
      console.log(JSON.parse(response.body))
      store.commit("admin/setUsers", JSON.parse(response.body))
    })

    stomp.subscribe('/user/update', response => {
      store.commit("admin/updateUser", JSON.parse(response.body))
    })

    stomp.subscribe('/user/create', response => {
      store.commit("admin/createUser", JSON.parse(response.body))
    })

    stomp.subscribe('/user/delete', response => {
      store.commit("admin/deleteUser", JSON.parse(response.body))
    })

    stomp.subscribe('/status/getAll', response => {
      store.commit("tasks/setStatus", JSON.parse(response.body))
    })

    stomp.subscribe('/task/getAll', response => {
      store.commit("tasks/loadingTasks", false)
      store.commit("tasks/setTasks", JSON.parse(response.body))
    })

    stomp.subscribe('/task/getOne', response => {
      store.commit("tasks/loadingDetails", false)
      store.commit("tasks/taskDetails", JSON.parse(response.body))
    })

    stomp.subscribe('/task/create', response => {
      store.commit("tasks/loadingActionTask", false)
      store.commit("tasks/createTask", JSON.parse(response.body))
    })

    stomp.subscribe('/task/update', response => {
      store.commit("tasks/updateTask", JSON.parse(response.body))
    })

    stomp.subscribe('/task/patch', response => {
      store.commit("tasks/updateTask", JSON.parse(response.body))
    })

    stomp.subscribe('/task/delete', response => {
      store.commit("tasks/deleteTask", JSON.parse(response.body))
    })

    stomp.subscribe('/task/makeComment', response => {
      store.commit("tasks/makeComment", JSON.parse(response.body))
    })

    stomp.send("/app/getAllUser")
    stomp.send("/app/getAllTask")
    stomp.send("/app/getAllStatus")

  }, error => {
    if(error.headers.message ==="401"){
      store.commit("tasks/loadingTasks", true)

      store.dispatch("admin/getAllUsers")

      Vue.notify({
        group: 'Api',
        title: `${error.headers.message}`,
        data: {},
        text: 'WebSocket, токен устарел',
        type: 'error',
        duration: 1000000
      });

      setTimeout(stompConnect, 5000);
    }
  })
}

new Vue({
  router,
  store,
  ...plugins,
  render: h => h(App)
}).$mount('#app')
