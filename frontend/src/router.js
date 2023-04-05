import Vue from 'vue'
import Router from 'vue-router'
import EventCreate from './views/EventCreate.vue'
import EventList from './views/EventList.vue'
import EventShow from './views/EventShow.vue'
import NProgress from 'nprogress'
import store from '@/store/store'
import NotFound from './views/NotFound.vue'
import NetworkIssue from './views/NetworkIssue.vue'
import SearchUser from './views/SearchUser.vue'
import RegisterUser from './views/RegisterUser.vue'
import LoginUser from './views/LoginUser.vue'
import Home from './views/Home.vue'

Vue.use(Router)

const router = new Router({
  // helps to get rid of the ugly # in url
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter: (to, from , next) => {
        if (from.path === '/' && store.getters['login_user/loggedIn']) {
          next(false);
        } else {
          next();
        }
        if (store.getters['login_user/loggedIn']) {
          next({ name: 'event-list' })
        } else {
          next()
        }
      }
    },
    {
      path: '/events',
      name: 'event-list',
      component: EventList,
      meta: { requiresAuth: true },
      props: true
    },
    {
      path: '/search',
      name: 'search-user',
      component: SearchUser,
      meta: { requiresAuth: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterUser
    },
    {
      path: '/login',
      name: 'login',
      component: LoginUser
    },
    {
      path: '/event/:id',
      name: 'event-show',
      component: EventShow,
      props: true,
      beforeEnter(routeTo, routeFrom, next) {
        store
          .dispatch('event/fetchEvent', routeTo.params.id)
          .then(event => {
            routeTo.params.event = event
            next()
          })
          .catch(error => {
            if (error.response && error.response.status === 404) {
              next({ name: '404', params: { resource: 'event' } })
            } else {
              next({ name: 'network-issue' })
            }
          })
      }
    },
    {
      path: '/event/create',
      name: 'event-create',
      component: EventCreate
    },
    {
      path: '/404',
      name: '404',
      component: NotFound,
      props: true
    },
    {
      path: '/network-issue',
      name: 'network-issue',
      component: NetworkIssue
    },
    {
      path: '*',
      redirect: { name: '404', params: { resource: 'page' } }
    }
  ]
})

router.beforeEach((routeTo, routeFrom, next) => {
  NProgress.start()
  // const loggedIn = store.getters['login_user/loggedIn']
  const loggedIn = localStorage.getItem('user')
  if (routeTo.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    next({ name: 'login' })
  }
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
