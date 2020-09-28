import store from "@/store";
import {Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {BackendUrl} from "@/constants";
import Vue from "vue";

export default async function stompConnect() {
    const stomp = Stomp.over(() => new SockJS(`${BackendUrl}/aegis_crm_system`))
    const currentUser = await store.dispatch('auth/getCurrentAuthUser')
    Vue.prototype.$stomp = stomp;

    if (currentUser !== null) {
        let currentUserIndent = `/user/${store.getters['user/currentUser'].email}`

        stomp.connect({"Authorization": store.getters["auth/token"]}, frame => {
            store.commit("tasks/loadingTasks", true)
            store.commit("ws/WSConnect", true)

            console.log('connected success')

            stomp.subscribe(`${currentUserIndent}/usr/getAll`, response => {
                console.log(JSON.parse(response.body), 12)
                store.commit("users/setUsers", JSON.parse(response.body))
            })
            stomp.subscribe('/usr/update', response => {
                store.commit("users/updateUser", JSON.parse(response.body))
            })
            stomp.subscribe('/usr/create', response => {
                store.commit("users/createUser", JSON.parse(response.body))
            })
            stomp.subscribe('/usr/delete', response => {
                store.commit("users/deleteUser", JSON.parse(response.body))
            })
            stomp.subscribe(`${currentUserIndent}/status/getAll`, response => {
                store.commit("tasks/setStatus", JSON.parse(response.body))
            })

            stomp.subscribe(`${currentUserIndent}/task/getAll`, response => {
                store.commit("tasks/loadingTasks", false)
                store.commit("tasks/setTasks", JSON.parse(response.body))
            })
            stomp.subscribe(`${currentUserIndent}/task/create`, response => {
                store.dispatch("tasks/createdTaskFromWS", JSON.parse(response.body))
            })
            stomp.subscribe(`${currentUserIndent}/task/update`, response => {
                store.dispatch("tasks/updatedTaskFromWS", JSON.parse(response.body))
            })
            stomp.subscribe(`${currentUserIndent}/task/patch`, response => {
                store.dispatch("tasks/updatedTaskFromWS", JSON.parse(response.body))
            })
            stomp.subscribe(`${currentUserIndent}/task/delete`, response => {
                store.dispatch("tasks/deletedTaskFromWS", JSON.parse(response.body))
            })

            stomp.subscribe(`${currentUserIndent}/response/task/create/success`, response => {
                store.commit('tasks/loadingActionTask', false)
                store.commit('tasks/dialogCreateUpdateTask', false)
            })
            stomp.subscribe(`${currentUserIndent}/response/task/update/success`, response => {
                store.commit('tasks/loadingActionTask', false)
                store.commit('tasks/dialogCreateUpdateTask', false)
            })
            stomp.subscribe(`${currentUserIndent}/response/task/patch/success`, response => {
                store.commit('tasks/loadingActionTask', false)
                store.commit('tasks/dialogCreateUpdateTask', false)
            })
            stomp.subscribe(`${currentUserIndent}/response/task/delete/success`, response => {

            })
            stomp.subscribe(`${currentUserIndent}/response/task/comment/success`, response => {
                store.dispatch('tasks/createdCommentSuccessFromWS', JSON.parse(response.body))
            })

            stomp.subscribe(`${currentUserIndent}/task/error`, response => {
                console.log(response, 'response')
            })

            stomp.send("/app/getAllUser")
            stomp.send("/app/getAllTask", {}, JSON.stringify(store.getters['tasks/filters']))
            stomp.send("/app/getAllStatus")

        }, async error => {
            if (error.headers.message === "401") {
                store.commit("tasks/loadingTasks", true)

                await store.dispatch('auth/tokenVerify').then(async tokenVerifyIsValid => {
                    if (!tokenVerifyIsValid) return await store.dispatch('auth/getTokenByRefresh').then(async refreshTokenSuccess => {
                        if (refreshTokenSuccess) {
                            stompConnect();
                        } else {
                            store.commit('auth/logout')

                            stomp.disconnect()
                        }
                    })
                })

                Vue.notify({
                    group: 'Api',
                    title: `${error.headers.message}`,
                    data: {},
                    text: 'WebSocket, токен устарел',
                    type: 'error',
                    duration: 1000000
                });

                // setTimeout(stompConnect, 5000);
            }
        })
    }
}