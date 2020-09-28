import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Auth from '../views/Auth.vue'
import NotFound from '../views/errors/NotFound'
import PermissionDenied from '../views/errors/AccessDenied'
import Tasks from '../views/tasks/Tasks'
import CanbanTask from '../views/tasks/CanbanTask'
import Administration from '../views/admin/Administration'
import TableTask from '../views/tasks/TableTask'
import TaskDetails from '../views/tasks/TaskDetails'
import CRUD_Users from '../views/users/CRUD_Users'
import store from '../store'
import { RouteNames } from '@/constants'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/permissionDenied',
    name: 'PermissionDenied',
    component: PermissionDenied,
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
        name: 'CanbanTask',
        component: CanbanTask,
        meta: {
          requiresAuth: true
        },
      },
      {
        path: 'table',
        name: 'TableTask',
        component: TableTask,
        meta: {
          requiresAuth: true
        },
      },
      {
        path: '/tasks/:id',
        name: 'TaskDetails',
        component: TaskDetails,
        meta: {
          requiresAuth: true
        },
      }
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
    path: '/users',
    name: 'admin',
    component: Administration,
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    },
    children: [
      {
        path: '',
        name: 'users',
        component: CRUD_Users,
        meta: {
          requiresAuth: true,
          requiresAdmin: true
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
    if(to.matched.some(record => record.meta.requiresAdmin)){
      if (store.getters["auth/token"] && store.getters["user/currentUserIsAdmin"]) {
        next()
      } else {
        next({
          path: '/permissionDenied',
        })
      }
    } else {
      if (!store.getters["auth/token"]) {
        next({
          path: '/auth',
        })
      } else {
        next()
      }
    }
  } else if (to.matched.some(record => record.meta.requiresVisitor)) {
    if (store.getters["auth/token"]) {
      next({
        path: '/',
      })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresAuth) && to.matched.some(record => record.meta.requiresAdmin)) {

  } else {
    next() // make sure to always call next()!
  }
})

export default router
