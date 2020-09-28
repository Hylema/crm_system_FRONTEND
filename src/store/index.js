import Vue from 'vue'
import Vuex from 'vuex'
import header from './header'
import ui from './ui'
import auth from './auth'
import theme from './theme'
import tasks from './tasks'
import notification from './notification'
import users from './users'
import files from './files'
import user from './user'
import loading from './loading'
import ws from './ws'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    header,
    ui,
    auth,
    theme,
    tasks,
    notification,
    users,
    files,
    user,
    loading,
    ws,
  },
  strict: false
})
