import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Auth from '../views/Auth.vue'
import Error from '../views/errors/NotFound'
import Tasks from '../views/tasks/Tasks'
import MyTask from '../views/tasks/MyTask'
import Administration from '../views/admin/Administration'
import InstructedTask from '../views/tasks/InstructedTask'
import CRUD_Users from '../views/admin/CRUD_Users'
import store from '../store'
import { RouteNames } from '../constants'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    name: 'Error',
    component: Error,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/tasks',
    name: RouteNames.TASKS,
    component: Tasks,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'MyTasks',
        component: MyTask,
        meta: {
          requiresAuth: true
        },
      },
      {
        path: 'instructed',
        name: 'Instructed',
        component: InstructedTask,
        meta: {
          requiresAuth: true
        },
      },
    ],
    // beforeEnter: (to, from, next) => {
    //   console.log('33333333333333333333333333')
    //
    //   let savedRoutesNames = store.getters['header/savedRoutesNames']
    //   let routeName = savedRoutesNames[RouteNames.TASKS]
    //
    //   if(routeName && from.name !== routeName) {
    //     next({name: RouteNames.TASKS})
    //   }
    //   else next()
    // },
    // beforeEach : (to, from, next) => {
    //
    //   console.log('beforeEach')
    //
    //   store.commit('header/saveRoute', {
    //     route: RouteNames.TASKS,
    //     name: to.name,
    //   })
    // }
  },
  {
    path: '/admin',
    name: 'admin',
    component: Administration,
    meta: {
      requiresVisitor: true
    },
    children: [
      {
        path: '',
        name: 'users',
        component: CRUD_Users,
        meta: {
          requiresAuth: true
        },
      },
    ],
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,
    meta: {
      requiresVisitor: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.getters["auth/loggedIn"]) {
      next({
        path: '/auth',
      })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresVisitor)) {
    if (store.getters["auth/loggedIn"]) {
      next({
        path: '/',
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})

export default router
