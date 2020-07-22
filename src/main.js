import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import plugins from './plugins'
import backToTop from './components/backButton/back_button'

Vue.config.productionTip = false

Vue.component('back-to-top', backToTop)

Vue.axios.defaults.baseURL = 'http://193.176.79.41';

new Vue({
  router,
  store,
  ...plugins,
  render: h => h(App)
}).$mount('#app')
