import Vue from 'vue'
import { Api } from '@/constants'

const state = {
    user: localStorage.getItem('user') || {},
    isAdmin: localStorage.getItem('admin') || false,
};

const actions = {
    async changeAvatar({ commit, dispatch }, file) {
        let formData = new FormData()

        if(file !== null){
            formData.append('file', file)
        }

        return await Vue.axios.post(Api.USER.CHANGE_AVATAR, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            console.log(response, 'avatar')
            commit('setUser', response.data)
        }).catch(error => {})
    }
};

const mutations = {
    setUser(state, user){
        localStorage.setItem('user', JSON.stringify(user))
        state.user = user

        Vue.set(state.user, user)

        if(user.roles != null){
            const roles = user.roles

            roles.forEach((role) => {
                if(role.role === 'ROLE_ADMIN'){
                    localStorage.setItem('admin', true)

                    state.isAdmin = true
                }
            })
        }
    },
};

const getters = {
    currentUser: state => {
        if(state.user != null) {
            try {
                return JSON.parse(state.user)
            } catch (e) {
                return state.user
            }
        }

        return null
    },
    currentUserIsAdmin: state => {
        return state.isAdmin
    }
};

export default {
    state,
    getters,
    actions,
    mutations,
    namespaced: true
}