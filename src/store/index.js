import Vue from 'vue'
import Vuex from 'vuex'
import header from './header'
import ui from './ui'
import auth from './auth'
import theme from './theme'
import tasks from './tasks'
import admin from './admin'
import notification from './notification'
import users from './users'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    header,
    ui,
    auth,
    theme,
    tasks,
    admin,
    notification,
    users
  },
  strict: false
})
