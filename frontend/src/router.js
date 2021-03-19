import Vue from 'vue'
import Router from 'vue-router'
import home from './views/home.vue'
import board from './views/board.vue'
import boards from './views/boards.vue'
import archive from './cmps/menu/archive.vue'
import loginSignup from './views/login-signup.vue'
import userDetails from './views/user-details.vue'
import taskDetails from './cmps/task-details/task-details.vue'

Vue.use(Router)

export const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/board',
      name: 'board',
      component: boards,

    },
    {
      path: '/board/:boardId',
      component: board,
      children: [
        {
          path: 'task/:taskId',
          component: taskDetails
        }
      ]
    },
    {
      path: '/login',
      name: 'loginSignup',
      component: loginSignup
    },
    {
      path: '/user/:id',
      name: 'user-details',
      component: userDetails
    },
    {
      path: '/archive',
      name: 'archive',
      component: archive
    }
  ]
})
