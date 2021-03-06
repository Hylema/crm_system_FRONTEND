import Vue from 'vue'
import vuetify from "../../plugins/vuetify";

const state = {
  tabs: [
    {
      title: 'Главная',
      icon: 'home',
      route: '/',
    },
    {
      title: 'Документы',
      icon: 'mdi-file-document-outline',
      route: '/documents'
    },
    {
      title: 'Задачи',
      icon: 'mdi-clipboard-list-outline',
      route: '/tasks',
      name: 'Tasks',
      children: [
        {
          title: 'Канбан',
          path: 'canban',
          name: 'CanbanTask',
          icon: 'mdi-clipboard-list-outline',
          route: '',
        },
        {
          title: 'Таблица',
          path: 'table',
          name: 'TableTask',
          icon: 'mdi-clipboard-list-outline',
          route: 'instructed',
        },
      ]
    },
    {
      title: 'Администрирование',
      icon: 'mdi-monitor',
      route: '/users',
      name: 'Admin',
      children: [
        {
          title: 'Пользователи',
          name: 'users',
          icon: 'mdi-account',
          route: '',
        },
      ]
    },
  ],
  drawer: true,
  currentPageTitle: 'Главная',
  themeIsDark: localStorage.getItem('dark_theme') || false,
  savedRoutesNames: {}
};

const mutations = {
  drawer(state, value){
    state.drawer = value;
  },
  currentPageTitle(state, value){
    state.currentPageTitle = value;
  },
  saveRoute(state, params){
    console.log(params, 'params')
    state.savedRoutesNames[params.route] = params.name;
  },
};

const getters = {
  tabs: state => state.tabs,
  drawer: state => state.drawer,
  currentPageTitle: state => state.currentPageTitle,
  themeIsDark: state => state.themeIsDark,
  savedRoutesNames: state => state.savedRoutesNames,
};

export default {
  state,
  mutations,
  getters,
  namespaced: true
}
