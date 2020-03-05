import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import QuillFormats from './views/QuillFormats.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home
    },
    {
      path: '/About',
      name: 'About',
      component: About
    },
    {
      path: '/QuillFormats',
      name: 'QuillFormats',
      component: QuillFormats
    }
  ]
})
