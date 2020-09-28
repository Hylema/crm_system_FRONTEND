import Vue from 'vue'
import store from '@/store'
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'


// const socket = new SockJS('http://localhost:9090/aegis_crm_system')
// const stomp = Stomp.over(socket)
// Vue.prototype.$stomp = stomp;
//
console.log(store)
//
// stomp.connect({"Authorization": store.getters["auth/loggedIn"]}, frame => {
//     stomp.send("/app/getAllUser")
//
//     stomp.subscribe('/user/getAll', response => {
//         store.commit("users/setUsers", JSON.parse(response.body))
//     })
//
//     stomp.subscribe('/user/update', response => {
//         store.commit("users/updateUser", JSON.parse(response.body))
//     })
//
//     stomp.subscribe('/user/create', response => {
//         store.commit("users/createUser", JSON.parse(response.body))
//     })
//
//     stomp.subscribe('/user/delete', response => {
//         store.commit("users/deleteUser", JSON.parse(response.body))
//     })
// }, error => {
//     console.log("===============================================", error.headers.message)
//     if(error.headers.message ==="401"){
//         store.dispatch("users/getAllUsers")
//     }
// })
